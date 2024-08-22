import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

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
        const response = await fetch(`http://localhost:3000/api/chatroom/info/${roomName}`, {
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
        setIsCreator(data.createdBy._id === userId);  // Check if the logged-in user is the creator
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoomInfo();

  }, [roomName]);

  const handleJoinRoom = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:3000/api/chatroom/join/${roomName}`, {
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
      const response = await fetch(`http://localhost:3000/api/chatroom/leave/${roomName}`, {
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
        const response = await fetch(`http://localhost:3000/api/chatroom/delete/${roomName}`, {
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
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBackToChatroom} className="text-blue-500 text-lg font-semibold hover:text-blue-700">
          &larr; Back
        </button>
        <h1 className="text-4xl font-bold text-center text-blue-600 flex-1">Room Information</h1>
      </div>
      {room ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong className="block text-gray-700 text-lg">Room Name:</strong>
            <div className="text-gray-900 text-2xl">{room.name}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong className="block text-gray-700 text-lg">Description:</strong>
            <div className="text-gray-900 text-xl">{room.description}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong className="block text-gray-700 text-lg">Creator:</strong>
            <div className="text-gray-900 text-xl">{room.createdBy.username}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong className="block text-gray-700 text-lg">Created At:</strong>
            <div className="text-gray-900 text-xl">{new Date(room.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <strong className="block text-gray-700 text-lg">Members:</strong>
            <ul className="list-disc pl-5 text-xl text-gray-900">
              {room.members.map(member => (
                <li key={member._id}>{member.username}</li>
              ))}
            </ul>
          </div>
            {error && <div className="text-red-500 text-center text-lg">{error}</div>}
          <div className="flex justify-between mt-8">
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
      ) : (
        <div className="text-center text-gray-700 text-lg animate-pulse">Loading room information...</div>
      )}
    </div>
  );
};

export default RoomInfo;
