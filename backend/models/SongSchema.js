const mongoose = require('mongoose');
const musicMetadata = require('music-metadata'); // Library for extracting audio metadata
const path = require('path'); // To handle file paths
const fs = require('fs/promises'); // File system module for promises

const SongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  image: { type: String, required: true },
  audioUrl: { type: String, required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  duration: { type: Number }, // Duration in seconds
});

// Middleware to calculate and set duration before saving the song
SongSchema.pre('save', async function (next) {
  try {
    if (this.audioUrl && !this.duration) {
      const audioFilePath = path.join(__dirname, '..', this.audioUrl);

      // Check if the file exists
      await fs.access(audioFilePath);

      // Use musicMetadata to extract metadata
      const metadata = await musicMetadata.parseFile(audioFilePath);

      // Set duration in seconds
      if (metadata.format && metadata.format.duration) {
        this.duration = Math.round(metadata.format.duration); // Round to the nearest second
      }
    }

    next();
  } catch (error) {
    console.error('Error calculating song duration:', error);
    next(error);
  }
});

// Middleware to update the album's total duration after saving a song
SongSchema.post('save', async function () {
  if (this.albumId) {
    try {
      const Album = mongoose.model('Album');
      const album = await Album.findById(this.albumId);

      if (album) {
        // Trigger recalculation of the album's total duration
        await album.save();
      }
    } catch (error) {
      console.error('Error updating album total duration:', error);
    }
  }
});

module.exports = mongoose.model('Song', SongSchema);
