import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { usePlaylist } from '../context/PlaylistContext';
import { FiMusic, FiUser, FiClock, FiHeart, FiPlayCircle, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import PlaylistModal from '../components/PlaylistModal';

function Profile() {
  const { isLoggedIn, user } = useContext(UserContext);
  const { playlists, loading, deletePlaylist, updatePlaylist } = usePlaylist();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    memberSince: ''
  });

  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('playlists');
  const [likedSongs, setLikedSongs] = useState([]);
  const optionsRef = useRef(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          username: decoded.username || 'User',
          memberSince: new Date(decoded.iat * 1000).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      await deletePlaylist(playlistId);
      setShowOptions(null);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      setError('Failed to delete playlist');
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditPlaylist(playlist);
    setShowOptions(null);
  };

  // If not logged in, redirect to login
  const token = localStorage.getItem('token');
  if (!token && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handlePlaylistUpdate = async (updatedPlaylist) => {
    try {
      const updated = await updatePlaylist(updatedPlaylist._id, updatedPlaylist);
      setEditPlaylist(null);
      setShowOptions(null);
    } catch (error) {
      console.error('Error updating playlist:', error);
      setError('Failed to update playlist');
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/album/${playlistId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-white p-6">
      {/* Profile Header */}
      <div className="relative">
        {/* Profile Info Section */}
        <div className="px-4 md:px-8 py-4 md:py-8">
          {/* Glassmorphism Card */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-4 md:p-8 shadow-2xl border border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10"></div>
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-cyan-500/5 backdrop-blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Profile Picture Section */}
              <div className="relative group">
                {/* Animated Border */}
                <div className="absolute -inset-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-violet-600 via-cyan-500 to-fuchsia-500 opacity-75 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:blur"></div>
                </div>

                {/* Profile Picture Container */}
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] group-hover:scale-105 transition-all duration-500">
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Profile Icon Container */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <FiUser className="w-16 h-16 md:w-24 md:h-24 text-white/70 group-hover:text-white transition-all duration-500" />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-white text-xs md:text-sm font-medium tracking-wide">Change Photo</span>
                  </div>
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center md:text-left">
                {/* Username and Badge */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                      {userInfo.username}
                    </span>
                  </h1>

                  {/* Animated Verified Badge */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-gradient-to-r from-violet-500 to-cyan-500 p-1.5 rounded-full group-hover:scale-105 transition duration-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* User Handle and Status */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
                  <p className="text-base md:text-lg font-medium text-white/70">@{userInfo.username.toLowerCase()}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <p className="text-cyan-400 text-xs md:text-sm font-medium">Online</p>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8">
                  <div className="group cursor-pointer">
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-violet-400 transition-all duration-500">
                      {playlists.length}
                    </p>
                    <p className="text-xs md:text-sm text-white/60 group-hover:text-white/80 transition-colors">Playlists</p>
                  </div>
                  <div className="w-px h-8 md:h-10 bg-gradient-to-b from-white/5 to-white/10"></div>
                  <div className="group cursor-pointer">
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-500">
                      0
                    </p>
                    <p className="text-xs md:text-sm text-white/60 group-hover:text-white/80 transition-colors">Followers</p>
                  </div>
                  <div className="w-px h-8 md:h-10 bg-gradient-to-b from-white/5 to-white/10"></div>
                  <div className="group cursor-pointer">
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent group-hover:from-fuchsia-400 group-hover:to-cyan-400 transition-all duration-500">
                      0
                    </p>
                    <p className="text-xs md:text-sm text-white/60 group-hover:text-white/80 transition-colors">Followers</p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button className="relative group px-6 md:px-8 py-2 md:py-3 mt-4 md:mt-0 rounded-full overflow-hidden w-full md:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0.5 rounded-full bg-[#0D1117] group-hover:bg-black/50 transition-colors duration-500"></div>
                <span className="relative text-sm md:text-base font-medium bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-500">
                  Edit Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">

          {/* Playlists Card */}
          <div
            onClick={() => setActiveTab('playlists')}
            className={`cursor-pointer bg-gradient-to-br ${activeTab === 'playlists'
                ? 'from-[#23272e] to-[#1A202C] ring-2 ring-green-500/30'
                : 'from-[#282828] to-[#1f1f1f] hover:from-[#23272e] hover:to-[#1A202C]'
              } transition-all duration-300 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-8 -top-8 w-32 md:w-40 h-32 md:h-40 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className={`p-3 md:p-4 ${activeTab === 'playlists' ? 'bg-green-500/20' : 'bg-green-500/10'
                  } rounded-xl md:rounded-2xl group-hover:bg-green-500/20 transition-all duration-300 backdrop-blur-xl ring-1 ring-white/10 group-hover:ring-white/20`}>
                  <FiMusic className="w-6 h-6 md:w-8 md:h-8 text-green-400 group-hover:text-green-300 group-hover:animate-pulse" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm md:text-base font-medium mb-0.5 md:mb-1 group-hover:text-gray-300">Playlists</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:to-white transition-colors duration-300">
                    {playlists.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liked Songs Card */}
          <div
            onClick={() => setActiveTab('liked')}
            className={`cursor-pointer bg-gradient-to-br ${activeTab === 'liked'
                ? 'from-[#23272e] to-[#1A202C] ring-2 ring-pink-500/30'
                : 'from-[#282828] to-[#1f1f1f] hover:from-[#23272e] hover:to-[#1A202C]'
              } transition-all duration-300 p-4 md:p-8 rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute -right-8 -top-8 w-32 md:w-40 h-32 md:h-40 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-all duration-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className={`p-3 md:p-4 ${activeTab === 'liked' ? 'bg-pink-500/20' : 'bg-pink-500/10'
                  } rounded-xl md:rounded-2xl group-hover:bg-pink-500/20 transition-all duration-300 backdrop-blur-xl ring-1 ring-white/10 group-hover:ring-white/20`}>
                  <FiHeart className="w-6 h-6 md:w-8 md:h-8 text-pink-400 group-hover:text-pink-300 group-hover:animate-pulse" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm md:text-base font-medium mb-0.5 md:mb-1 group-hover:text-gray-300">Liked Songs</p>
                  <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:to-white transition-colors duration-300">
                    {likedSongs.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'playlists' ? (
        <>
          {/* Playlists Grid */}
          <div className="px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {/* Create Playlist Card */}
              <div
                onClick={() => setShowCreateModal(true)}
                className="relative bg-[#282828] p-4 sm:p-5 md:p-6 transform transition duration-300 hover:shadow-3xl cursor-pointer rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-green-500/30 backdrop-blur-md group"
              >
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-transparent group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 via-emerald-400/10 to-transparent group-hover:opacity-100 transition-opacity duration-500 delay-75"></div>

                {/* Glowing circle behind icon */}
                <div className="relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 mx-auto transform transition duration-500 shadow-lg shadow-green-500/30 relative group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse group-hover:animate-none opacity-75"></div>
                    <FiMusic className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white relative z-10 group-hover:animate-bounce" />
                  </div>
                </div>

                {/* Text content */}
                <div className="relative z-10">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white group-hover:text-green-400 transition-colors duration-300">Create New</p>
                  <p className="text-xs sm:text-sm text-gray-400 text-center mt-1 sm:mt-2 md:mt-3 transition duration-500">Create custom playlist</p>
                </div>

                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-green-500/30 group-hover:glow transition-all duration-500"></div>
              </div>

              {/* Playlist Cards */}
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer group"
                  style={{
                    boxShadow: '0px 0px 10px rgba(0, 128, 0, 0.5)',
                    WebkitBoxShadow: '0px 0px 10px rgba(0, 128, 0, 0.5)',
                    MozBoxShadow: '0px 0px 10px rgba(0, 128, 0, 0.5)',
                  }}
                >
                  <div onClick={() => handlePlaylistClick(playlist._id)}>
                    <div className="aspect-square mb-2 sm:mb-3 md:mb-4 rounded-xl sm:rounded-2xl bg-[#3c3c3c] overflow-hidden">
                      {playlist.image ? (
                        <img
                          src={`http://localhost:5000${playlist.image}`}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiMusic className="text-2xl sm:text-3xl md:text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-0 sm:mb-1 truncate">{playlist.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{playlist.description || 'No description'}</p>
                  </div>

                  {/* Options Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowOptions(showOptions === playlist._id ? null : playlist._id);
                    }}
                    className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1 sm:p-2 bg-black/40 group-hover:opacity-100 hover:bg-[#4c4c4c] rounded-full transition-all duration-300 z-10"
                  >
                    <FiMoreVertical className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>

                  {/* Options Dropdown */}
                  {showOptions === playlist._id && (
                    <div
                      ref={optionsRef}
                      className="absolute top-8 sm:top-10 md:top-12 right-1 sm:right-2 bg-[#282828] border border-[#3e3e3e] rounded-md shadow-lg z-20 py-1 min-w-[120px] sm:min-w-[140px]"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlaylist(playlist);
                        }}
                        className="w-full px-3 py-1 sm:px-4 sm:py-2 text-left hover:bg-[#3e3e3e] flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(playlist._id);
                        }}
                        className="w-full px-3 py-1 sm:px-4 sm:py-2 text-left hover:bg-[#3e3e3e] text-red-400 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="px-4 md:px-8">
          <div className="bg-gradient-to-br from-[#282828] to-[#2c2c2c] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Liked Songs</h2>
              <p className="text-gray-400">{likedSongs.length} songs</p>
            </div>
            {likedSongs.length > 0 ? (
              <div className="space-y-4">
                {likedSongs.map((song) => (
                  <div key={song._id} className="flex items-center justify-between p-3 hover:bg-[#383838] rounded-lg group transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#383838] rounded overflow-hidden">
                        <img src={song.image} alt={song.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{song.name}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-400">{song.duration}</p>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FiHeart className="w-5 h-5 text-green-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium mb-2">Songs you like will appear here</p>
                <p className="text-gray-400">Save songs by tapping the heart icon</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Playlist Creation/Edit Modal */}
      <PlaylistModal
        isOpen={showCreateModal || editPlaylist !== null}
        onClose={() => {
          setShowCreateModal(false);
          setEditPlaylist(null);
        }}
        onPlaylistCreated={(playlist) => {
          setShowCreateModal(false);
        }}
        onPlaylistUpdated={handlePlaylistUpdate}
        isCreating={!editPlaylist}
        playlist={editPlaylist}
      />

      {/* Account Details */}
      <div className="px-4 md:px-8 py-6 mb-20">
        <h2 className="text-2xl font-bold mb-6">Account Details</h2>
        <div className="bg-[#282828] rounded-xl p-6 space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <p className="text-gray-400 mb-1">Member Since</p>
            <p className="font-medium">{userInfo.memberSince}</p>
          </div>
          <div className="border-b border-gray-700 pb-4">
            <p className="text-gray-400 mb-1">Account Type</p>
            <p className="font-medium">Free</p>
          </div>

          {/* Premium Upgrade Button */}
          <div className="pt-4">
            <button
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold tracking-widest uppercase overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:from-violet-700 active:to-indigo-700 focus:ring focus:ring-violet-300 transition-all duration-300"
            >
              {/* Glowing orbs */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-violet-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse-slow animation-delay-500"></div>

              {/* Sparkles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-sparkle"></div>
                <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-white rounded-full opacity-60 animate-sparkle animation-delay-300"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-sparkle animation-delay-700"></div>
              </div>

              {/* Gradient border */}
              <div className="absolute inset-0.5 rounded-lg bg-gradient-to-r from-violet-600/20 to-indigo-600/20 backdrop-blur-xl"></div>

              {/* Button content */}
              <div className="relative flex items-center space-x-3">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent text-lg">
                  Switch to Premium
                </span>
                <svg
                  className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.9; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }
          .animation-delay-500 {
            animation-delay: 500ms;
          }
        `}</style>
      </div>
    </div>
  );
}

export default Profile;
