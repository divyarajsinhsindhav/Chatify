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
    <div className="max-w-md mx-auto p-8 mt-10 bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 rounded-xl shadow-lg">
  <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">Profile</h1>
  {user ? (
    <div>
      {isEditing ? (
        <>
          <div className="mb-6">
            <label className="text-blue-800 font-semibold">Username:</label>
            <input
              type="text"
              name="username"
              value={updatedUser.username}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="text-blue-800 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <strong className="text-blue-800">Username:</strong>
            <div className="text-gray-900 mt-1 text-lg">{user.username}</div>
          </div>
          <div className="mb-6">
            <strong className="text-blue-800">Email:</strong>
            <div className="text-gray-900 mt-1 text-lg">{user.email}</div>
          </div>
          <div className="mb-6">
            <strong className="text-blue-800">Joined:</strong>
            <div className="text-gray-900 mt-1 text-lg">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-6 rounded-lg transition-all"
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
