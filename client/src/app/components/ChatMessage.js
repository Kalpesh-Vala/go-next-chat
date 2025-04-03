// src/app/components/ChatMessage.js
import { formatMessageTime, isSameDay } from '../utils/dateUtils';

export default function ChatMessage({ message, currentUser, selectedChat, previousMessage }) {
  const isCurrentUser = message.sender === currentUser;
  const isCommonChat = selectedChat === 'common';
  const showDate = !previousMessage || !isSameDay(new Date(message.time), new Date(previousMessage.time));
  
  return (
    <div className="mb-4">
      {showDate && (
        <div className="text-center my-4">
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
            {new Date(message.time).toLocaleDateString()}
          </span>
        </div>
      )}
      
      <div
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {isCommonChat && !isCurrentUser && (
            <div className="font-medium text-xs mb-1">
              {message.sender}
            </div>
          )}
          
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatMessageTime(message.time)}
          </div>
        </div>
      </div>
    </div>
  );
}
