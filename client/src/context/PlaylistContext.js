import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import UserContext from './UserContext';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const fetchPlaylists = useCallback(async () => {
    if (!user || !user._id) {
      setPlaylists([]);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/playlists/user', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      // Sort playlists by creation date, most recent first
      const sortedPlaylists = (response.data.playlists || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setPlaylists(sortedPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error.response || error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createPlaylist = async (playlistData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add playlist data to formData
      formData.append('name', playlistData.name);
      if (playlistData.description) {
        formData.append('description', playlistData.description);
      }
      if (playlistData.image) {
        formData.append('image', playlistData.image);
      }

      const response = await axios.post('http://localhost:5000/api/playlists', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Fetch updated playlists to ensure consistency
      await fetchPlaylists();
      return response.data.playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Fetch updated playlists
      await fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  };

  const updatePlaylist = async (playlistId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add update data to formData
      if (updateData.name) formData.append('name', updateData.name);
      if (updateData.description) formData.append('description', updateData.description);
      if (updateData.image) formData.append('image', updateData.image);

      const response = await axios.put(`http://localhost:5000/api/playlists/${playlistId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Fetch updated playlists
      await fetchPlaylists();
      return response.data.playlist;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  };

  // Initial fetch when user changes
  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    }
  }, [user?._id]);

  return (
    <PlaylistContext.Provider value={{ 
      playlists, 
      loading, 
      fetchPlaylists, 
      deletePlaylist,
      createPlaylist,
      updatePlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

export default PlaylistContext;
