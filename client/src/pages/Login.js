import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaMusic } from "react-icons/fa";
import axios from 'axios';
import img from "../assets/Login1.jpg";
import UserContext from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useNavigate();
  const baseUrl = "http://localhost:5000";
  const { login } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
      if (response.data.token) {
        login(response.data.token);
        history('/');
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-32 bg-black text-white relative">
      
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center py-8 hidden lg:block">
        <img
          src={img}
          alt="Login Visual"
          className="w-[80%] h-auto max-h-[300px] md:max-h-[400px] object-contain animate-pulse"
        />
      </div>

      {/* Login Box */}
      <div className="relative w-full max-w-md px-6 py-10 backdrop-blur-md bg-white bg-opacity-10 rounded-lg shadow-lg mx-4 mb-10 lg:mb-0"
        style={{ boxShadow: '0px 0px 10px #00FF00' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Log in to BajateRaho</h2>

        <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 rounded text-white hover:bg-blue-700">
          <FaFacebook className="mr-2" /> Continue with Facebook
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <span className="px-2 bg-gray-800 text-gray-400 z-10">OR</span>
          <div className="absolute inset-x-0 border-t border-gray-700"></div>
        </div>

        {errorMessage && (
          <div className="bg-red-600 text-white text-center py-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 rounded text-white hover:bg-green-600"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-400">Don't have an account?</span>{' '}
          <Link to="/register" className="text-green-400 hover:underline">
            Sign up for Spotify
          </Link>
        </div>

        <Link to={'/'}>
          <FaMusic className='text-green-600 text-3xl md:text-4xl absolute -top-10 left-1/2 transform -translate-x-1/2' />
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm font-bold text-gray-300 mb-4 lg:mb-0 lg:absolute lg:bottom-8 w-full">
        Created with 💚 from Tabrej
      </footer>
    </div>
  );
};

export default Login;
