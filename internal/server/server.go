package server

import (
	"net/http"
	"strings"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/kalpesh-vala/go-react-chat/internal/handlers"
)

// JWT secret key
var jwtSecret = []byte("your_secret_key")

// Server structure to hold the application components
type Server struct {
	router  *gin.Engine
	clients sync.Map // Thread-safe map for storing client connections
}

// NewServer creates a new server instance with configured routes
func NewServer() *Server {
	s := &Server{
		router: gin.Default(),
	}

	// Add CORS middleware
	s.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	s.setupRoutes()
	return s
}

// setupRoutes configures all the routes for the application
func (s *Server) setupRoutes() {
	// API Routes
	api := s.router.Group("/api")
	{
		// User routes
		api.POST("/users", handlers.CreateUser)
		api.GET("/users", handlers.GetUsers)
		api.GET("/users/:id", handlers.GetUser)

		// Auth route
		api.POST("/login", handlers.Login)
	}

	// WebSocket route with JWT middleware
	s.router.GET("/ws/:userId", jwtMiddleware(), func(c *gin.Context) {
		handlers.HandleWS(c, &s.clients)
	})
}

// jwtMiddleware validates the JWT token
func jwtMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Pass userId to the context
		c.Set("userId", claims["userId"])
		c.Next()
	}
}

// Start begins listening on the specified address
func (s *Server) Start(addr string) error {
	return s.router.Run(addr)
}
