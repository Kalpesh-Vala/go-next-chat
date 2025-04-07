'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAllUsers } from '../services/userService';
import { warmupBackend } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatMessage from '../components/ChatMessage';
import UserList from '../components/UserList';
import ChatInput from '../components/ChatInput';
import { parseJwt } from '../utils/jwtUtils';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState('common');
  const [socket, setSocket] = useState(null);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
      router.push('/login');
      return;
    }

    const tokenData = parseJwt(token);
    const userId = tokenData?.userId;

    if (!userId) {
      console.error('Could not extract user ID from token');
      toast.error('Authentication error. Please log in again.');
      router.push('/login');
      return;
    }

    setCurrentUser(username);

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

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/${userId}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      toast.success('Connected to chat server');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
        
        if (chatContainerRef.current) {
          setTimeout(() => {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }, 100);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Chat connection error. Please try refreshing the page.');
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      if (event.code !== 1000) {
        toast.error('Disconnected from chat server');
      }
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Component unmounting');
      }
    };
  }, [router]);

  const sendMessage = (content) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to chat server');
      return;
    }

    const message = {
      type: 'message',
      content,
      recipient: selectedChat === 'common' ? '' : selectedChat,
      sender: currentUser,
      time: new Date().toISOString(),
    };

    // Only optimistically update messages for personal chats
    if (selectedChat !== 'common') {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    socket.send(JSON.stringify(message));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (socket) socket.close();
    router.push('/');
  };

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

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 bg-white">
          <UserList users={users} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        </div>
        <div className="w-3/4 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
            <h2 className="font-medium text-gray-800">
              {selectedChat === 'common' ? 'Common Chat' : `Chat with ${selectedChat}`}
            </h2>
          </div>
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto chat-scroll">
            {filteredMessages.length > 0 ? (
              <div className="space-y-3">
                {filteredMessages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    currentUser={currentUser}
                    selectedChat={selectedChat}
                    previousMessage={filteredMessages[i - 1]} // Pass the previous message
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {selectedChat === 'common'
                  ? 'No messages in common chat yet. Start the conversation!'
                  : `Start a conversation with ${selectedChat}`}
              </div>
            )}
          </div>
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}