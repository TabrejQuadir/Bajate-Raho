import { createContext, useState, useEffect } from 'react';
import { useAudioPlayer } from './AudioPlayerContext';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const {setCurrentSong} = useAudioPlayer();

  const login = async (token) => {
    try {
      setIsLoggedIn(true);
      localStorage.setItem('token', token);
      
      // Get user data from backend
      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      console.log('User data fetched:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentSong(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data);
          setIsLoggedIn(true);
          console.log('User restored from token:', response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          logout(); // Clear invalid token
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
