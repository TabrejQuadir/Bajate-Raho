import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UserContext from "../context/UserContext";
import { FiLogOut } from "react-icons/fi";
import { FaMusic } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useContext(UserContext); // Check user login status

  const token = localStorage.getItem("token");
  let username = "User"; // Default value

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username || "User"; // Assuming 'username' is a field in the token payload
    } catch (error) {
      console.error("Invalid token", error.message);
    }
  }

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 h-16 px-6">
      <div className="flex-1 flex justify-center px-2">
        <div className="relative w-full max-w-[80%] sm:max-w-md md:max-w-xl group ">
          {/* Outer glow container */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-green-400 to-green-300 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>

          {/* Animated border container */}
          <div className="absolute -inset-[1px] rounded-full overflow-hidden ">
            <div
              className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #22c55e 90deg, #4ade80 180deg, #86efac 270deg, transparent 360deg)",
              }}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full p-4 sm:p-3 pl-12 sm:pl-10 bg-gray-800 text-[12px] sm:text-sm text-white rounded-full outline-none placeholder-gray-400 
        border border-white/5 shadow-lg
        focus:shadow-green-500/30 group-hover:bg-gray-800/90
        transition-all duration-300 relative z-10"
            />

            {/* Search icon container */}
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/20 rounded-full blur-xl transition-all duration-300"></div>
                <FaSearch className="text-gray-400 group-hover:text-green-400 transition-colors duration-300 relative z-10 text-base sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Keyframes */}
          <style jsx>{`
      @keyframes placeholderShine {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      input::placeholder {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.3) 0%,
          rgba(255, 255, 255, 0.6) 25%,
          rgba(255, 255, 255, 0.3) 50%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        animation: placeholderShine 3s linear infinite;
      }

      .group:hover input::placeholder {
        opacity: 0.8;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
        </div>
      </div>



      <div className="flex items-center gap-2 sm:gap-4 relative ">
        {isLoggedIn ? (
          <div className="relative">
            <FaUserCircle
              className="text-white text-2xl sm:text-3xl cursor-pointer rounded-full bg-gray-700 p-1.5 sm:p-2 hover:bg-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <div
              className={`absolute z-50 right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl transform transition-all duration-300 origin-top-right border border-white/10 ${isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                }`}
            >
              {/* Welcome Section with Gradient */}
              <div className="p-4 text-white text-sm flex items-center border-b border-white/10 bg-gradient-to-r from-green-500 to-green-400 rounded-t-xl">
                <div className="bg-gradient-to-r from-green-500 to-green-400 p-2 rounded-full mr-3">
                  <FaUserCircle className="text-xl" />
                </div>
                <div>
                  <p className="font-medium">Welcome,</p>
                  <p className="font-bold text-white">{username}!</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* My Profile Button */}
                <button
                  className="w-full px-4 py-3 text-left text-white rounded-lg flex items-center space-x-3 hover:bg-white/10 transition-all duration-200 group"
                  onClick={() => {
                    navigate("/profile");
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                    <FaUserCircle className="text-green-400 group-hover:text-green-300 transition-colors duration-200" />
                  </span>
                  <span className="font-medium">My Profile</span>
                </button>

                {/* Logout Button */}
                <button
                  className="w-full px-4 py-3 text-left text-white rounded-lg flex items-center space-x-3 hover:bg-white/10 transition-all duration-200 group mt-1"
                  onClick={handleLogout}
                >
                  <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                    <FiLogOut className="text-red-400 group-hover:text-red-300 transition-colors duration-200" />
                  </span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              className="bg-gradient-to-r from-green-500 to-green-400 text-white 
             px-4 py-1.5 text-sm sm:text-base sm:px-6 sm:py-2
             rounded-full font-semibold hover:shadow-lg hover:shadow-green-500/30 
             transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="hidden sm:block bg-white text-gray-800 
             px-4 py-1.5 text-sm sm:text-base sm:px-6 sm:py-2
             rounded-full font-semibold hover:shadow-lg hover:bg-gray-50 
             transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => navigate("/register")}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
