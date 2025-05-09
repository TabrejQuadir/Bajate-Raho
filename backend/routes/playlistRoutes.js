const express = require('express');
const router = express.Router();
const { protect } = require('../middilware/authMiddleware');
const { imageUpload } = require('../middilware/multerConfig');
const {
    createPlaylist,
    getUserPlaylists,
    getPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist
} = require('../controllers/playlistController');

// Create a new playlist
router.post('/', protect, imageUpload.single('image'), createPlaylist);

// Get all playlists for the logged-in user
router.get('/user', protect, getUserPlaylists);

// Get a specific playlist
router.get('/:id', protect, getPlaylist);

// Add a song to a playlist
router.post('/add-song', protect, addSongToPlaylist);

// Remove a song from a playlist
router.delete('/:playlistId/songs/:songId', protect, removeSongFromPlaylist);

// Delete a playlist
router.delete('/:id', protect, deletePlaylist);

// Update playlist details
router.put('/:id', protect, imageUpload.single('image'), updatePlaylist);

module.exports = router;
