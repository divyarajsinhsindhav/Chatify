import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../utils/apiFetch';

export default function Search() {
  const [roomName, setRoomName] = useState('');
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const navigate = useNavigate()

  const fetchRoom = async () => {
    try {
      const response = await apiFetch(`/api/chatroom/find/${roomName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Room not found');
      }

      const data = await response.json();
      setRoom(data.room);
      setCanJoin(data.joinroom);
      setError(null);
    } catch (error) {
      setError(error.message);
      setRoom(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === '') {
      setError('Please enter a room name');
      setRoom(null);
    } else {
      fetchRoom();
    }
  };

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
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();

      navigate(`/chatroom/${roomName}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-4">
      <h1 className="text-2xl font-bold mb-4">Find Chat Room</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter room name to find Chat Room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
        >
          Find Room
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {room && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold">{room.name}</h2>
          <p>{room.description}</p>
          {!canJoin && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
              <p>You are already a member of this room.</p>
            </div>
          )}
          {canJoin && (
            <button
              onClick={handleJoinRoom}
              className="mt-4 w-full p-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
            >
              Join Room
            </button>
          )}
        </div>
      )}
    </div>
  );
}
