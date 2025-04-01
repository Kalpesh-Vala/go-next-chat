package server

import (
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kalpesh-vala/go-react-chat/internal/handlers"
)

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
	// // Serve static files
	// s.router.Static("/static", "./static")
	// s.router.LoadHTMLGlob("static/*.html")

	// // Home page
	// s.router.GET("/", func(c *gin.Context) {
	// 	c.HTML(200, "index.html", nil)
	// })

	// API Routes
	api := s.router.Group("/api")
	{
		// User routes
		api.POST("/users", handlers.CreateUser)
		api.GET("/users", handlers.GetUsers)
		api.GET("/users/:id", handlers.GetUser)
	}

	// WebSocket route
	s.router.GET("/ws/:userId", func(c *gin.Context) {
		handlers.HandleWS(c, &s.clients)
	})
}

// Start begins listening on the specified address
func (s *Server) Start(addr string) error {
	return s.router.Run(addr)
}
