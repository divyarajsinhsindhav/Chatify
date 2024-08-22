import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/chatroom');
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-pink-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-8 animate-pulse drop-shadow-lg">
          Welcome to Chat App
        </h1>
        <p className="text-xl mb-8 font-light animate-fade-in-up">
          Connect with your friends and family anytime, anywhere.
        </p>
        <div className="space-x-4 animate-fade-in-up delay-2">
          <Link
            to="/login"
            className="bg-blue-700 hover:bg-blue-800 transition-colors duration-300 ease-in-out text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 transition-colors duration-300 ease-in-out text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
