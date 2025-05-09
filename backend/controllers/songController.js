const Song = require('../models/SongSchema');
const Album = require('../models/AlbumSchema');
const mongoose = require('mongoose');

exports.createSong = async (req, res) => {
    try {
        const { albumId, name, artist } = req.body;

        // Debug logging
        console.log('Files received:', req.files);
        console.log('Body received:', req.body);

        // Validate uploaded files
        if (!req.files || !req.files.audioFile || !req.files.image) {
            console.log('Missing files. req.files:', req.files); // Debug which files are missing
            return res.status(400).json({
                success: false,
                message: 'Both audio and image files are required'
            });
        }

        const audioFile = req.files.audioFile[0];
        const imageFile = req.files.image[0];

        // Debug logging
        console.log('Audio file:', audioFile);
        console.log('Image file:', imageFile);

        // Create a new song instance with Cloudinary URLs
        const songData = {
            name,
            artist,
            image: imageFile.path,      // Cloudinary image URL
            audioUrl: audioFile.path,    // Cloudinary audio URL
            releaseDate: new Date()
        };

        const song = new Song(songData);

        // Handle album association
        if (albumId) {
            if (!mongoose.Types.ObjectId.isValid(albumId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid album ID format'
                });
            }

            const album = await Album.findById(albumId);
            if (!album) {
                return res.status(404).json({
                    success: false,
                    message: 'Album not found'
                });
            }

            // Avoid duplicate song entries
            if (!album.songs.includes(song._id)) {
                album.songs.push(song._id);
                await album.save();
            }

            // Associate song with the album
            song.albumId = albumId;
        }

        // Save the song
        await song.save();

        // Return populated song data
        const populatedSong = await Song.findById(song._id)
            .populate('albumId');

        res.status(201).json({
            success: true,
            message: 'Song created successfully',
            song: populatedSong
        });
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating song',
            error: error.message
        });
    }
};

// Get all songs
exports.getSongs = async (req, res) => {
    try {
        const songs = await Song.find().populate('albumId');
        res.status(200).json({
            success: true,
            songs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching songs',
            error: error.message
        });
    }
};

exports.getSingleSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate('albumId');
        
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        res.status(200).json({
            success: true,
            song
        });
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching song',
            error: error.message
        });
    }
};