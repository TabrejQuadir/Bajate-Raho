const Song = require('../models/SongSchema');
const Album = require('../models/AlbumSchema');
const path = require('path');


// Create a new song
const mongoose = require('mongoose');

// Create a new song
exports.createSong = async (req, res) => {
    try {
        console.log('Files:', req.files); // Logs uploaded files for debugging
        const { albumId, name, artist } = req.body;

        // Validate uploaded files
        const audioFile = req.files.audioFile ? req.files.audioFile[0] : null;
        const imageFile = req.files.image ? req.files.image[0] : null;

        if (!audioFile || !imageFile) {
            return res.status(400).json({ error: 'Both audio and image files are required' });
        }

        const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac'];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!validAudioTypes.includes(audioFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid audio file type. Only MP3, WAV, and FLAC are allowed.' });
        }

        if (!validImageTypes.includes(imageFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid image file type. Only JPEG, PNG, and GIF are allowed.' });
        }

        // Prepare paths for uploaded files
        const audioUrl = `/uploads/audio/${audioFile.filename}`;
        const imageUrl = `/uploads/images/${imageFile.filename}`;

        // Create a new song instance
        const songData = {
            name,
            artist,
            image: imageUrl,
            audioUrl,
            releaseDate: new Date(),
        };

        const song = new Song(songData);

        // Handle album association
        if (albumId) {
            // Validate `albumId` format
            if (!mongoose.Types.ObjectId.isValid(albumId)) {
                return res.status(400).json({ error: 'Invalid album ID format' });
            }

            const album = await Album.findById(albumId);
            if (!album) {
                return res.status(404).json({ error: 'Album not found' });
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

        res.status(201).json(song);
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get all songs
exports.getSongs = async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getSingleSong = async (req, res) => {
    try {
      console.log('Song ID:', req.params.id); // Log the song ID
      const song = await Song.findById(req.params.id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      console.log(song, 'zzz'); // Log the song if found
      res.json(song);
    } catch (error) {
      console.error('Error fetching song:', error);
      res.status(500).json({ error: error.message });
    }
  };
  