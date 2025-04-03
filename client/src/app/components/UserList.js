// src/app/components/UserList.js
export default function UserList({ users, selectedChat, onSelectChat }) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">Chats</h2>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {/* Common Chat Option */}
          <div
            className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center ${
              selectedChat === 'common' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => onSelectChat('common')}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-medium">#</span>
            </div>
            <div>
              <p className="font-medium">Common Chat</p>
              <p className="text-xs text-gray-500">Group messages</p>
            </div>
          </div>
          
          <div className="pt-2 pb-1 px-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Online Users</p>
          </div>
          
          {/* User List */}
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center ${
                  selectedChat === user.username ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onSelectChat(user.username)}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-gray-500">{user.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No users online</div>
          )}
        </div>
      </div>
    );
  }