import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaPlus, FaList, FaTimes, FaMusic, FaHeadphones, FaImage, FaUpload } from 'react-icons/fa';
import UserContext from '../context/UserContext';
import { usePlaylist } from '../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaylistModal = ({ isOpen, onClose, onPlaylistCreated, onPlaylistUpdated, isCreating, playlist, song, isEditing }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCreatingState, setIsCreating] = useState(isCreating);
    const { isLoggedIn } = useContext(UserContext);
    const { createPlaylist, updatePlaylist, playlists } = usePlaylist();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        setIsCreating(isCreating);
        if (playlist && !isCreating) {
            setName(playlist.name || '');
            setDescription(playlist.description || '');
            setPreviewUrl(playlist.image ? `http://localhost:5000${playlist.image}` : '');
        } else {
            setName('');
            setDescription('');
            setSelectedImage(null);
            setPreviewUrl('');
        }
        setError('');
        setSuccess('');
    }, [playlist, isCreating, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double submission
        setLoading(true);
        setError('');
        setSuccess('');

        if (!name.trim()) {
            setError('Please enter a playlist name');
            setLoading(false);
            return;
        }

        try {
            const playlistData = {
                name: name.trim(),
                description: description.trim(),
                image: selectedImage
            };

            if (isCreatingState) {
                const newPlaylist = await createPlaylist(playlistData);
                setSuccess('Playlist created successfully!');
                if (onPlaylistCreated) {
                    onPlaylistCreated(newPlaylist);
                }
                // Reset form
                setName('');
                setDescription('');
                setSelectedImage(null);
                setPreviewUrl('');
            } else {
                const updatedPlaylist = await updatePlaylist(playlist._id, playlistData);
                setSuccess('Playlist updated successfully!');
                if (onPlaylistUpdated) {
                    onPlaylistUpdated(updatedPlaylist);
                }
            }

            setTimeout(() => {
                onClose();
                setSuccess('');
                setIsCreating(false);
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'An error occurred while saving the playlist');
        } finally {
            setLoading(false);
        }
    };

    const addSongToPlaylist = async (playlistId) => {
        if (!isLoggedIn) {
            navigate('/login');
            onClose();
            return;
        }

        const playlist = playlists.find(p => p._id === playlistId);
        if (playlist && song && playlist.songs.includes(song._id)) {
            setError('This song is already in the playlist');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/playlists/add-song', {
                playlistId,
                songId: song._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess('Song added to playlist successfully!');
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 1500);
        } catch (error) {
            console.error('Error adding song to playlist:', error);
            setError(error.response?.data?.message || 'Failed to add song to playlist');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setSelectedImage(null);
        setPreviewUrl('');
        setError('');
        setIsCreating(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-[#2c2c2c] to-[#1c1c1c] p-8 rounded-xl w-[520px] max-h-[85vh] overflow-y-auto relative shadow-2xl transform transition-all duration-300 scale-100">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center animate-fadeIn">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-center animate-fadeIn">
                        {success}
                    </div>
                )}

                {!isCreatingState && song ? (
                    <>
                        <h2 className="text-3xl font-bold mb-8 text-white">Add to Playlist</h2>
                        <div className="mb-8">
                            <button
                                onClick={() => {
                                    setName('');
                                    setDescription('');
                                    setSelectedImage(null);
                                    setPreviewUrl('');
                                    setIsCreating(true);
                                }}
                                className="w-full flex items-center gap-4 p-5 bg-[#2c2c2c] hover:bg-[#3c3c3c] rounded-xl transition-all duration-300 hover:shadow-lg group border border-gray-700/50"
                            >
                                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">
                                    <FaPlus className="text-black text-2xl" />
                                </div>
                                <span className="text-xl font-semibold text-white">Create New Playlist</span>
                            </button>
                        </div>
                    </>
                ) : null}

                {(isCreatingState || name || description || previewUrl) ? (
                    <div className="animate-slideUp">
                        <h3 className="text-3xl font-bold mb-8 text-white">{isCreatingState ? "Create Playlist" : "Edit Playlist"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="mb-6">
                                <div
                                    className="w-full aspect-square mb-4 rounded-xl bg-[#3c3c3c] flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img
                                                src={previewUrl}
                                                alt="Playlist cover"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <FaUpload className="text-4xl text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FaImage className="text-4xl text-gray-400 mb-2" />
                                            <p className="text-gray-400 text-sm">Choose playlist cover image</p>
                                            <p className="text-gray-500 text-xs mt-1">(Max size: 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#3c3c3c] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-gray-500"
                                    placeholder="My Awesome Playlist"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#3c3c3c] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-white placeholder-gray-500 min-h-[100px] resize-none"
                                    placeholder="Give your playlist a catchy description"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-8 py-3 rounded-full hover:bg-[#3c3c3c] transition-all duration-300 text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full transition-all duration-300 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {loading ? 'Creating...' : isCreatingState ? 'Create' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {playlists.map((playlist) => {
                            const hasSong = song && playlist.songs && playlist.songs.includes(song._id);
                            return (
                                <div key={playlist._id} className="relative group">
                                    <button
                                        onClick={() => addSongToPlaylist(playlist._id)}
                                        disabled={hasSong}
                                        className={`w-full flex items-center gap-4 p-4 hover:bg-[#3c3c3c] rounded-xl transition-all duration-300 ${hasSong ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                                            } border border-transparent hover:border-gray-700/50`}
                                    >
                                        <div className="w-16 h-16 bg-[#3c3c3c] rounded-xl flex items-center justify-center group-hover:bg-[#4c4c4c] transition-all duration-300">
                                            <FaHeadphones className="text-2xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-semibold text-lg text-white group-hover:text-green-500 transition-colors duration-300">
                                                {playlist.name}
                                            </div>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <FaMusic className="text-xs" />
                                                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                                            </div>
                                        </div>
                                    </button>
                                    {hasSong && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 bg-[#2c2c2c] px-3 py-1 rounded-full border border-gray-700/50">
                                            Already added
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistModal;
