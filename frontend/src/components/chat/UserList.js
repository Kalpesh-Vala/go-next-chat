import { useState } from 'react';
import { getUserColor } from '@/utils/helpers';

export default function UserList({ users, currentUserId, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term and exclude current user
  const filteredUsers = users
    .filter(user => user.id !== currentUserId)
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Chats</h2>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => onSelectUser(null)}
          className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
              All
            </div>
            <div className="ml-3">
              <div className="font-medium">Broadcast Channel</div>
              <div className="text-sm text-gray-500">Public messages</div>
            </div>
          </div>
        </button>
        
        {filteredUsers.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          >
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: getUserColor(user.id) }}
              >
                {user.username[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">
                  {user.status === 'online' ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </span>
                  ) : (
                    'Offline'
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}