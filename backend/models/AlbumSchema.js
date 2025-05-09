const mongoose = require('mongoose');

// Define the Album schema
const AlbumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    backgroundColor: { type: String },
    image: { type: String },
    description: { type: String, default: '', maxlength: 500 },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    totalDuration: { type: Number, default: 0 }, // Total duration in seconds
    averageRating: { type: Number, default: 0 }, // Average rating of songs
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

// Middleware to calculate total duration and average rating before saving the album
AlbumSchema.pre('save', async function (next) {
  if (this.songs && this.songs.length > 0) {
    try {
      const Song = mongoose.model('Song');
      const songs = await Song.find({ _id: { $in: this.songs } });

      // Calculate total duration
      this.totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);

      // Calculate average rating
      const totalRatings = songs.reduce((acc, song) => acc + (song.rating || 0), 0);
      this.averageRating = songs.length > 0 ? totalRatings / songs.length : 0;
    } catch (error) {
      console.error('Error calculating album details:', error);
      return next(error);
    }
  } else {
    this.totalDuration = 0;
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model('Album', AlbumSchema);
