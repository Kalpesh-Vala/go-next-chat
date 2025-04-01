package main

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/kalpesh-vala/go-react-chat/internal/server"
)

func main() {
	// Set working directory to project root
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("Unable to get the current filename")
	}
	dir := filepath.Dir(filename)
	err := os.Chdir(dir)
	if err != nil {
		log.Fatal("Unable to change working directory:", err)
	}

	// Create and start server
	s := server.NewServer()
	log.Println("Starting server on :8080")
	if err := s.Start(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
