'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import UserList from '@/components/chat/UserList';
import ChatWindow from '@/components/chat/ChatWindow';
import MessageInput from '@/components/chat/MessageInput';
import useWebSocket from '@/hooks/useWebSocket';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null); // null = broadcast channel
  
  // Initialize WebSocket connection
  const { messages, users, connected, error, sendMessage } = useWebSocket(user?.id);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Handler for sending messages
  const handleSendMessage = (content) => {
    sendMessage(content, selectedChat);
  };
  
  // Handler for selecting a chat
  const handleSelectChat = (userId) => {
    setSelectedChat(userId);
  };
  
  if (!isAuthenticated || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* User list / sidebar */}
        <div className="w-80 flex-shrink-0">
          <UserList 
            users={users} 
            currentUserId={user.id} 
            onSelectUser={handleSelectChat}
          />
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {error ? (
            <div className="flex-1 flex items-center justify-center bg-red-50 text-red-700 p-4">
              {error}
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-hidden">
                <ChatWindow 
                  messages={messages} 
                  users={users} 
                  currentUser={user}
                  selectedChat={selectedChat}
                />
              </div>
              
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={!connected}
                placeholder={connected ? "Type a message..." : "Connecting..."}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}