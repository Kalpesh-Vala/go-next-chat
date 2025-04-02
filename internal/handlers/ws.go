package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/kalpesh-vala/go-react-chat/internal/models"
)

// Configure the WebSocket upgrader
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections for simplicity
	},
}

// Client represents a WebSocket connection along with user information
type Client struct {
	ID       string
	Conn     *websocket.Conn
	Send     chan []byte
	Username string
}

// HandleWS upgrades HTTP connection to WebSocket and manages the connection
func HandleWS(c *gin.Context, clients *sync.Map) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Upgrade to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Failed to upgrade connection:", err)
		return
	}

	// Create a new client
	client := &Client{
		ID:       userId.(string),
		Conn:     conn,
		Send:     make(chan []byte, 256),
		Username: "User-" + userId.(string),
	}

	// Register this client
	clients.Store(userId.(string), client)

	// Start goroutines for handling connections
	go client.writePump()
	go client.readPump(clients)

	// Send a welcome message
	welcomeMsg := models.Message{
		Type:    "system",
		Content: "Welcome to the chat!",
		Sender:  "System",
		Time:    time.Now(),
	}

	msgBytes, _ := json.Marshal(welcomeMsg)
	client.Send <- msgBytes
}

// readPump handles messages from the client
func (c *Client) readPump(clients *sync.Map) {
	defer func() {
		// Clean up connection
		c.Conn.Close()
		clients.Delete(c.ID)
		close(c.Send)
	}()

	c.Conn.SetReadLimit(512) // Max message size
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		// Parse the incoming message
		var msg models.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Println("Failed to parse message:", err)
			continue
		}

		// Set sender information
		msg.Sender = c.Username
		msg.Time = time.Now()

		// Broadcast the message to the recipient or all clients
		msgBytes, _ := json.Marshal(msg)

		if msg.Recipient != "" {
			// Direct message to a specific user
			if recipient, ok := clients.Load(msg.Recipient); ok {
				recipient.(*Client).Send <- msgBytes
			}
		} else {
			// Broadcast to all users
			clients.Range(func(key, value interface{}) bool {
				client := value.(*Client)
				client.Send <- msgBytes
				return true
			})
		}
	}
}

// writePump sends messages to the WebSocket client
func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				// Channel was closed
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued messages
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			// Send ping to keep connection alive
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
