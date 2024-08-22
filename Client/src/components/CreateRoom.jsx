import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('')
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/chatroom/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName, description, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error( data.message || 'Something went wrong');
      }

      navigate('/chatroom/' + data.newRoom.name);
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage(error.message)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-4">
      <h1 className="text-2xl font-bold mb-4">Create Chat Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="roomName" className="block text-gray-700 text-sm font-bold mb-2">
            Room Name
          </label>
          <input
            type="text"
            id="roomName"
            placeholder="Enter the name of the room"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Enter the description of the room"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {message && <p className="text-red-500 text-xs italic mb-4">{message}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
