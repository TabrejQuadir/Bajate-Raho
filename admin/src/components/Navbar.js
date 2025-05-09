import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';


const Navbar = () => {
  return (
    <nav className="fixed z-10 top-0 left-0 right-0 bg-white px-16 bg-opacity-30 backdrop-blur-lg rounded-lg w-[99%] border border-teal-200 mx-auto p-4 shadow-lg flex items-center justify-between">
      {/* Left side with Logo and Title */}
      <div className="flex flex-col items-center space-x-4">
        
        <Link to="/" className="text-2xl font-bold text-green-400">
        <FaMusic className='inline-flex mr-6'/>
            Spotify Admin Dashboard</Link>
            
      </div>

      {/* Right side with Navigation Links */}
      <div className="space-x-6 text-green-400 flex items-center">
        <Link to="/" className="text-green-400 hover:text-green-500">Home</Link>
        <Link to="/add-album" className="text-green-400 hover:text-green-500">Add Album</Link>
        <Link to="/add-song" className="text-green-400 hover:text-green-500">Add Song</Link>
      </div>
    </nav>
  );
};

export default Navbar;
