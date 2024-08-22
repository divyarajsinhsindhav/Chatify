import React, { useState } from 'react';
import apiFetch from '../utils/apiFetch';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went Wrong!');
      }

    
      if (data) {
        localStorage.setItem('userId', data.id);
        localStorage.setItem('token', data.token);
        window.location.href = '/chatroom';
      }

      setMessage('Login successful!');
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {message && <p className="text-red-500 text-xs italic mb-4">{message}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-opacity-50"
              onClick={handleSubmit}
            >
              Login
            </button>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
