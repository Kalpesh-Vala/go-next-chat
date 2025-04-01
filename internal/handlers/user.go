package handlers

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/kalpesh-vala/go-react-chat/internal/models"
)

// In-memory user storage (for simplicity)
var (
	users     = make(map[string]models.User)
	userID    = 0
	userMutex sync.Mutex
)

// CreateUser handles user creation requests
func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userMutex.Lock()
	defer userMutex.Unlock()

	// Generate ID and save user
	userID++
	user.ID = strconv.Itoa(userID)
	users[user.ID] = user

	c.JSON(http.StatusCreated, user)
}

// GetUsers returns all users
func GetUsers(c *gin.Context) {
	userMutex.Lock()
	defer userMutex.Unlock()

	// Convert map to slice for JSON response
	userList := make([]models.User, 0, len(users))
	for _, user := range users {
		userList = append(userList, user)
	}

	c.JSON(http.StatusOK, userList)
}

// GetUser returns a specific user by ID
func GetUser(c *gin.Context) {
	id := c.Param("id")

	userMutex.Lock()
	defer userMutex.Unlock()

	user, exists := users[id]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
