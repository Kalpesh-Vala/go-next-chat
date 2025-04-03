// src/app/dashboard/page.js - Dashboard Page (Chat Interface)
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAllUsers } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatMessage from '../components/ChatMessage';
import UserList from '../components/UserList';
import ChatInput from '../components/ChatInput';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState('common'); // 'common' or username
  const [socket, setSocket] = useState(null);
  const chatContainerRef = useRef(null);
  const router = useRouter();
  
  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(username);
    
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData.filter(user => user.username !== username));
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load users. Please try again.');
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
    
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8080/ws/${username}?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      toast.success('Connected to chat server');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      
      // Scroll to bottom when new message arrives
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }, 100);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Chat connection error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return () => {
      if (ws) ws.close();
    };
  }, [router]);
  
  // Send message
  const sendMessage = (content) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to chat server');
      return;
    }
    
    const message = {
      type: 'message',
      content,
      recipient: selectedChat === 'common' ? '' : selectedChat,
    };
    
    socket.send(JSON.stringify(message));
  };
  
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (socket) socket.close();
    router.push('/');
  };
  
  // Filter messages for selected chat
  const filteredMessages = messages.filter((msg) => {
    if (selectedChat === 'common') {
      return !msg.recipient || msg.recipient === '';
    }
    return (
      (msg.sender === selectedChat && msg.recipient === currentUser) ||
      (msg.sender === currentUser && msg.recipient === selectedChat)
    );
  });
  
  if (isLoading) {
    return <LoadingSpinner message="Loading chat..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Go-Next-Chat</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium">{currentUser}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - User List */}
        <div className="w-1/4 border-r border-gray-200 bg-white">
          <UserList
            users={users}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        </div>
        
        {/* Right Panel - Chat Area */}
        <div className="w-3/4 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
            <h2 className="font-medium text-gray-800">
              {selectedChat === 'common' ? 'Common Chat' : `Chat with ${selectedChat}`}
            </h2>
          </div>
          
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto chat-scroll"
          >
            {filteredMessages.length > 0 ? (
              <div className="space-y-3">
                {filteredMessages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    currentUser={currentUser}
                    selectedChat={selectedChat}
                    previousMessage={i > 0 ? filteredMessages[i - 1] : null}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {selectedChat === 'common'
                  ? 'No messages in the common chat yet. Start the conversation!'
                  : `Start a conversation with ${selectedChat}`}
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}