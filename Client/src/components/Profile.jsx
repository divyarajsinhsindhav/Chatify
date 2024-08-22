import { useState, useEffect } from 'react';
import apiFetch from '../utils/apiFetch';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiFetch(`/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
        setUpdatedUser({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await apiFetch(`/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedUser),
      });

      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-5 bg-white border border-gray-300 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>
      {user ? (
        <div>
          {isEditing ? (
            <>
              <div className="mb-4">
                <label className="text-gray-700 font-semibold">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={updatedUser.username}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="text-gray-700 font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <strong className="text-gray-700">Username:</strong>
                <div className="text-gray-900">{user.username}</div>
              </div>
              <div className="mb-4">
                <strong className="text-gray-700">Email:</strong>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <div className="mb-4">
                <strong className="text-gray-700">Joined:</strong>
                <div className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-700">Loading user data...</div>
      )}
    </div>
  );
};

export default Profile;
