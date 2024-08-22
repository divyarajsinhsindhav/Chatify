import React from 'react';
import ChatBox from './ChatBox';
import RoomList from './RoomList';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const ChatRoom = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  if (!userId) {
    navigate('/login'); // Redirect to login if user is not authenticated
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <div className="w-1/4 p-4 bg-gray-800 text-white flex flex-col">
        {/* Profile and Logout Row */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="flex items-center p-2 bg-gray-600 rounded-md hover:bg-gray-500"
            onClick={() => navigate('/profile')}
          >
            <FaUser className="mr-2" />
            Profile
          </button>
          <button
            className="flex items-center p-2 bg-red-600 rounded-md hover:bg-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Find Chat Room Button */}
        <button
          className="mb-4 p-2 bg-blue-600 rounded-md hover:bg-blue-500"
          onClick={() => navigate('/chatroom/find')}
        >
          Find Chat Room
        </button>

        {/* Currently Joined Chat Rooms List */}
        <h2 className="text-lg font-bold mb-2">Currently Joined Chat Rooms</h2>
        <RoomList />

        {/* Create Room Button */}
        <button
          className="mt-auto p-2 bg-green-600 rounded-md hover:bg-green-500"
          onClick={() => navigate('/chatroom/create')}
        >
          Create Room
        </button>
      </div>

      {/* Chat Box Section */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatRoom;
