import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom'; 
import '../index.css';

const LoginModal = ({ isOpen, onClose, song, onRegister, onLogin }) => {
  const baseUrl = "http://localhost:5000";

  const songImage = song?.image ? `${baseUrl}${song.image}` : "/path/to/default-image.jpg";
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 bg-black bg-opacity-100 flex items-center justify-center p-4 transition-transform duration-700 ease-out",
        {
          "modal-enter": !isOpen,
          "modal-enter-active": isOpen
        }
      )}
    >
      <div className={classNames(
        "backdrop-blur-md bg-white bg-opacity-10 border border-white/100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto max-h-[90vh] overflow-y-auto transition-transform duration-1000 relative",
        {
          "card-enter": !isOpen,
          "card-enter-active": isOpen
        }
      )}>
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-300 hover:text-white text-2xl sm:text-3xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Song Image */}
          <div className="w-full md:w-2/5 flex justify-center">
            <img
              src={songImage}
              alt={song?.name || "Song"}
              className="rounded-lg object-cover w-full h-auto max-h-[200px] md:max-h-none md:h-[250px]"
            />
          </div>

          {/* Modal Content */}
          <div className="w-full md:w-3/5 md:pl-0 flex flex-col justify-center pt-0 md:pt-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white text-center md:text-left">
              Start listening with a free Spotify account
            </h2>
            <button
              onClick={handleRegister}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mb-3 sm:mb-4 transition w-full sm:w-auto"
            >
              Register Now
            </button>
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-300">
                Already have an account?{' '}
                <button 
                  onClick={handleLogin} 
                  className="text-blue-400 hover:text-blue-300 underline focus:outline-none"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;