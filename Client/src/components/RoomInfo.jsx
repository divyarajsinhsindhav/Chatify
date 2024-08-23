import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiFetch from '../utils/apiFetch';

const RoomInfo = () => {
  const { id: roomName } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await apiFetch(`/api/chatroom/info/${roomName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setRoom(data);

        const userId = localStorage.getItem('userId');
        setIsMember(data.members.some(member => member._id === userId));
        setIsCreator(data.createdBy._id === userId); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoomInfo();
  }, [roomName]);

  const handleJoinRoom = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await apiFetch(`/api/chatroom/join/${roomName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ roomName, userId, roomId: room._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      navigate(`/chatroom/${roomName}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      const response = await apiFetch(`/api/chatroom/leave/${roomName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ roomName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setIsMember(false);
      navigate('/chatroom');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBackToChatroom = () => {
    navigate(`/chatroom/${roomName}`);
  };

  const handleDeleteRoom = async () => {
    try {
      const response = await apiFetch(`/api/chatroom/delete/${roomName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      navigate('/chatroom');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="bg-gray-100 md:w-1/3 lg:w-1/4 p-6 border-r border-gray-300 flex flex-col space-y-6">
        <button onClick={handleBackToChatroom} className="text-blue-500 text-xl font-semibold hover:text-blue-700 flex items-center">
          &larr; Back
        </button>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
  <h1 className="text-4xl font-extrabold text-blue-600">
    {room ? room.name : 'Room Name'}
  </h1>
  
  <p className="text-xl text-gray-700">
    {room ? room.description : 'Room Description'}
  </p>
  
  <div className="flex items-center space-x-2 text-lg text-gray-600">
    <span className="font-medium">Creator:</span>
    <span className="text-gray-800">{room ? room.createdBy.username : 'Creator'}</span>
  </div>
  
  <div className="flex items-center space-x-2 text-lg text-gray-600">
    <span className="font-medium">Created At:</span>
    <span className="text-gray-800">{room ? new Date(room.createdAt).toLocaleDateString() : ''}</span>
  </div>
</div>

        {error && <div className="text-red-500 text-center text-lg">{error}</div>}
        <div className="flex flex-col space-y-4">
          {!isMember ? (
            <button
              onClick={handleJoinRoom}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Join Room
            </button>
          ) : (
            <button
              onClick={handleLeaveRoom}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Leave Room
            </button>
          )}
          {isCreator && (
            <button
              onClick={handleDeleteRoom}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Delete Room
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Members</h2>
        <ul className="space-y-4">
  {room ? (
    room.members.map(member => (
      <li key={member._id} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition-colors duration-200">
        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
          {member.username[0].toUpperCase()}
        </div>
        <div className="text-xl text-gray-700 font-semibold">
          {member.username}
        </div>
      </li>
    ))
  ) : (
    <div className="text-center text-gray-700 text-lg animate-pulse">Loading room information...</div>
  )}
</ul>

      </div>
    </div>
  );
};

export default RoomInfo;
