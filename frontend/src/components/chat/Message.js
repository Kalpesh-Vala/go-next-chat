import { formatMessageTime, getUserColor } from '@/utils/helpers';

export default function Message({ message, user, isOwnMessage }) {
  const { content, timestamp, senderId } = message;
  
  // Format the timestamp
  const formattedTime = formatMessageTime(timestamp);
  
  // Get a consistent color for the user
  const userColor = getUserColor(senderId);
  
  // For own messages, display differently
  if (isOwnMessage) {
    return (
      <div className="flex justify-end mb-2">
        <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words">
          <div className="text-sm">{content}</div>
          <div className="text-right text-xs text-indigo-100 mt-1">{formattedTime}</div>
        </div>
      </div>
    );
  }
  
  // For other user's messages
  return (
    <div className="flex justify-start mb-2">
      <div className="mr-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: userColor }}
        >
          {user?.username?.[0]?.toUpperCase() || '?'}
        </div>
      </div>
      <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words">
        <div className="font-medium text-xs mb-1" style={{ color: userColor }}>
          {user?.username || 'Unknown User'}
        </div>
        <div className="text-sm">{content}</div>
        <div className="text-right text-xs text-gray-500 mt-1">{formattedTime}</div>
      </div>
    </div>
  );
}