const Playlist = require('../models/PlaylistSchema');
const Song = require('../models/SongSchema');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        // Create playlist data object
        const playlistData = {
            name,
            description,
            user: userId
        };

        // If image was uploaded, add the image path
        if (req.file) {
            playlistData.image = `/uploads/images/${req.file.filename}`;
        }

        const playlist = new Playlist(playlistData);
        await playlist.save();

        res.status(201).json({
            success: true,
            playlist
        });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating playlist'
        });
    }
};

// Get all playlists for a user
exports.getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await Playlist.find({ user: userId })
            .populate('songs', 'name artist duration audioUrl image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            playlists
        });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching playlists'
        });
    }
};

// Get a single playlist by ID
exports.getPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate('songs', 'name artist duration audioUrl image')
            .populate('user', 'username');

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found'
            });
        }

        res.status(200).json({
            success: true,
            playlist
        });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching playlist'
        });
    }
};

// Add a song to a playlist
exports.addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const userId = req.user.id;

        // Check if playlist exists and belongs to user
        const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found or unauthorized'
            });
        }

        // Check if song exists
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Check if song is already in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({
                success: false,
                message: 'Song already in playlist'
            });
        }

        // Add song to playlist
        playlist.songs.push(songId);
        await playlist.save();

        res.status(200).json({
            success: true,
            message: 'Song added to playlist',
            playlist
        });
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding song to playlist'
        });
    }
};

// Remove a song from a playlist
exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.params;
        const userId = req.user.id;

        // Check if playlist exists and belongs to user
        const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found or unauthorized'
            });
        }

        // Remove song from playlist
        playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
        await playlist.save();

        res.status(200).json({
            success: true,
            message: 'Song removed from playlist',
            playlist
        });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing song from playlist'
        });
    }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user.id;

        const playlist = await Playlist.findOneAndDelete({ _id: playlistId, user: userId });
        
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Playlist deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting playlist'
        });
    }
};

// Update playlist details
exports.updatePlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlistId = req.params.id;
        const userId = req.user.id;

        const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found or unauthorized'
            });
        }

        // Update basic fields if provided
        if (name) playlist.name = name;
        if (description !== undefined) playlist.description = description;

        // Handle image upload if a new image is provided
        if (req.file) {
            // If there's a new image, update the image path
            playlist.image = '/uploads/images/' + req.file.filename;
        }

        await playlist.save();

        // Populate songs if needed
        const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

        res.status(200).json({
            success: true,
            playlist: updatedPlaylist
        });
    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating playlist'
        });
    }
};
