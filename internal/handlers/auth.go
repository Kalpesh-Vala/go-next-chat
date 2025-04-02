package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("your_secret_key") // Replace with a secure key

// LoginRequest represents the login payload
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse represents the response containing the JWT token
type LoginResponse struct {
	Token string `json:"token"`
}

// Login handles user authentication and returns a JWT token
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userMutex.Lock()
	defer userMutex.Unlock()

	// Find user by email and validate password
	for _, user := range users {
		if user.Email == req.Email && user.Password == req.Password {
			// Generate JWT token
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"userId": user.ID,
				"exp":    time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
			})
			tokenString, err := token.SignedString(jwtSecret)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
				return
			}

			c.JSON(http.StatusOK, LoginResponse{Token: tokenString})
			return
		}
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
}
