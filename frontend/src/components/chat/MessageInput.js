import { useState } from 'react';

export default function MessageInput({ onSendMessage, disabled, placeholder }) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder || "Type a message..."}
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
        >
          Send
        </button>
      </div>
    </form>
  );
}