package models

// User represents a chat participant
type User struct {
	ID       string `json:"id"`
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"` // New attribute
	Status   string `json:"status"`                      // "online", "offline", etc.
}
