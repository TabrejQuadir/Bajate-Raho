import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMusic } from "react-icons/fa";
import img from "../assets/Login2.jpg";

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = { email, username, password, confirmPassword };

    try {
      const response = await axios.post(`${baseUrl}/api/auth/register`, userData);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-32 bg-black text-white relative">

      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0 hidden lg:block">
        <img src={img} alt="Login Visual" className="w-[80%] max-h-[300px] object-contain animate-pulse" />
      </div>

      {/* Form Section */}
      <div className="relative w-full max-w-md p-6 sm:p-8 backdrop-blur-md bg-white bg-opacity-10 border border-green-500/40 rounded-lg shadow-lg"
           style={{ backdropFilter: 'blur(10px)', boxShadow: '0px 0px 10px #00FF00' }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Sign up for Bajate Raho</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 rounded text-white hover:bg-green-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-400">Already have an account?</span>{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </div>

        {/* Music Icon */}
        <Link to={'/'}>
          <FaMusic className='text-green-600 text-3xl sm:text-4xl absolute -top-10 sm:-top-14 left-[40%] sm:left-[45%]' />
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-sm font-bold text-gray-300 mb-4 lg:mb-0 lg:absolute lg:bottom-8 w-full">
        Created with 💚 from Tabrej
      </footer>
    </div>
  );
};

export default Register;
