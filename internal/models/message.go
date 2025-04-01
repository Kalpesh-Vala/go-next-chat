package models

import "time"

// Message represents a chat message
type Message struct {
	Type      string    `json:"type"`      // "chat", "system", etc.
	Content   string    `json:"content"`   // Message content
	Sender    string    `json:"sender"`    // User ID of sender
	Recipient string    `json:"recipient"` // User ID of recipient (empty for broadcast)
	Time      time.Time `json:"time"`      // Timestamp
}
