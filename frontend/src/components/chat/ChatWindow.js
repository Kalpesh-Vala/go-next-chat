import { useRef, useEffect } from 'react';
import Message from './Message';
import { formatDate, isNewDay, groupMessagesBySender } from '@/utils/helpers';

export default function ChatWindow({ messages, users, currentUser, selectedChat }) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Get title for the chat window
  const getChatTitle = () => {
    if (!selectedChat) {
      return 'Broadcast Channel';
    }
    
    const chatUser = users.find(u => u.id === selectedChat);
    return chatUser ? chatUser.username : 'Unknown User';
  };
  
  // Filter messages based on selected chat
  const filteredMessages = selectedChat 
    ? messages.filter(msg => 
        (msg.senderId === selectedChat && msg.recipientId === currentUser?.id) || 
        (msg.recipientId === selectedChat && msg.senderId === currentUser?.id)
      )
    : messages.filter(msg => !msg.recipientId); // Show only broadcast messages
  
  // Sort messages by timestamp
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  let lastDate = null;
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{getChatTitle()}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {sortedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {sortedMessages.map((message, index) => {
              const isNewDayMessage = isNewDay(lastDate, message.timestamp);
              if (isNewDayMessage) {
                lastDate = message.timestamp;
              }
              
              const messageUser = users.find(u => u.id === message.senderId);
              const isOwnMessage = message.senderId === currentUser?.id;
              
              return (
                <div key={index}>
                  {isNewDayMessage && (
                    <div className="flex justify-center my-4">
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <Message 
                    message={message} 
                    user={messageUser} 
                    isOwnMessage={isOwnMessage} 
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}