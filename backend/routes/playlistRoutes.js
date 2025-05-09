const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middilware/authMiddleware');
const {
    createPlaylist,
    getUserPlaylists,
    getPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist
} = require('../controllers/playlistController');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Create a new playlist
router.post('/', protect, upload.single('image'), createPlaylist);

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
router.put('/:id', protect, upload.single('image'), updatePlaylist);

module.exports = router;
