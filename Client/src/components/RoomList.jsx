import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/chatroom/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load chat rooms.');
        }

        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [userId]);

  return (
    <div className="flex flex-col gap-2">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Link
            to={`/chatroom/${room.name}`}
            key={room.id}
            className="p-2 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="text-sm text-gray-300">{room.description}</p>
          </Link>
        ))
      ) : (
        <p className="text-gray-400">No rooms found.</p>
      )}
    </div>
  );
};

export default RoomList;
