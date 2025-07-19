# 💬 GoNextChat – Real-time Chat App with Go & Next.js

![Go](https://img.shields.io/badge/Go-1.20+-skyblue?logo=go)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![WebSocket](https://img.shields.io/badge/WebSocket-enabled-green)
![License](https://img.shields.io/github/license/kalpesh-vala/kalpesh-vala-go-next-chat)

---

## 🌐 Live Demo

🚀 **[Visit the App →](https://go-next-chat.vercel.app/)**  
📍 Hosted on **Vercel** with a Go backend server running locally or on remote instance

---

## 📌 Project Overview

**GoNextChat** is a full-stack, real-time chat application built using **Go (Golang)** for the backend and **Next.js (React)** for the frontend. It supports user authentication, chat messaging, and real-time communication using **WebSockets**. This app follows a modular, maintainable structure for both backend and frontend, ensuring scalability and ease of development.

---

## 🧠 Features

✅ JWT-based user authentication  
✅ Real-time messaging via WebSockets  
✅ RESTful user APIs  
✅ Modular React components (Chat UI, User List, Input)  
✅ Dashboard with protected routes  
✅ Secure login & registration  
✅ Responsive and clean UI using Tailwind CSS  
✅ Hooks & utilities for date/time & JWT decoding

---

## 🏗️ Project Structure

```
kalpesh-vala-go-next-chat/
├── main.go # Entry point for Go server
├── go.mod / go.sum # Go dependencies
├── internal/
│ ├── handlers/ # HTTP and WS handlers
│ ├── models/ # Data models
│ └── server/ # Server setup and routing
├── client/ # Next.js frontend
│ ├── src/app/
│ │ ├── components/ # UI components
│ │ ├── hooks/ # Custom hooks
│ │ ├── services/ # API interaction logic
│ │ ├── login/, register/, dashboard/
│ │ └── utils/ # Helper functions
├── docs/ # Documentation
└── README.md
```


---

## 🛠️ Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Backend   | Go (Golang), WebSockets, JWT  |
| Frontend  | Next.js 14 (App Router), React|
| Styling   | Tailwind CSS                  |
| Auth      | JWT Tokens                    |
| API       | RESTful                       |
| Comm.     | WebSocket                     |
| Tools     | ESLint, PostCSS, Go Modules   |

---

## 🚀 Getting Started

### 🧱 Prerequisites
- Go 1.20+
- Node.js 18+
- Yarn or npm

### ⚙️ Run Backend (Go)

```bash
# In root directory
go run main.go
```

⚙️ Run Frontend (Next.js)
```bash
cd client
npm install
npm run dev
```

