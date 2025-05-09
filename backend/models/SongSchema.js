const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
const tmp = require('tmp');
const { getAudioDurationInSeconds } = require('get-audio-duration');

// Helper functions
const convertToSeconds = (duration) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

// Song schema
const SongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  image: { type: String, required: true },
  audioUrl: { type: String, required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  releaseDate: { type: Date, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  duration: { type: String, default: '0:00' },
  durationInSeconds: { type: Number, default: 0 }
});

// Pre-save hook to calculate duration
SongSchema.pre('save', async function (next) {
  if (!this.isModified('audioUrl') || this.durationInSeconds > 0) return next();

  try {
    const tmpFile = tmp.fileSync({ postfix: '.mp3' });
    const writer = fs.createWriteStream(tmpFile.name);

    const response = await axios({
      method: 'get',
      url: this.audioUrl,
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const seconds = await getAudioDurationInSeconds(tmpFile.name);
    this.durationInSeconds = Math.floor(seconds);
    this.duration = formatDuration(seconds);

    tmpFile.removeCallback();
    next();
  } catch (error) {
    console.error('Error calculating audio duration:', error);
    next();
  }
});

// Post-save hook to update album
SongSchema.post('save', async function () {
  if (!this.albumId) return;

  try {
    const Album = mongoose.model('Album');
    const album = await Album.findById(this.albumId).populate('songs');

    if (!album) return;

    if (!album.songs.some(song => song._id.equals(this._id))) {
      album.songs.push(this._id);
    }

    // Total duration and average rating
    const totalSeconds = album.songs.reduce((sum, song) => sum + (song.durationInSeconds || convertToSeconds(song.duration)), 0);
    const totalRatings = album.songs.reduce((sum, song) => sum + (song.rating || 0), 0);

    album.totalDuration = totalSeconds;
    album.averageRating = album.songs.length > 0 ? totalRatings / album.songs.length : 0;

    await album.save();
  } catch (error) {
    console.error('Error updating album:', error);
  }
});

// Post-remove hook to update album
SongSchema.post('remove', async function () {
  if (!this.albumId) return;

  try {
    const Album = mongoose.model('Album');
    const album = await Album.findById(this.albumId).populate('songs');

    if (!album) return;

    album.songs = album.songs.filter(song => !song._id.equals(this._id));

    const totalSeconds = album.songs.reduce((sum, song) => sum + (song.durationInSeconds || convertToSeconds(song.duration)), 0);
    const totalRatings = album.songs.reduce((sum, song) => sum + (song.rating || 0), 0);

    album.totalDuration = totalSeconds;
    album.averageRating = album.songs.length > 0 ? totalRatings / album.songs.length : 0;

    await album.save();
  } catch (error) {
    console.error('Error updating album after song removal:', error);
  }
});

module.exports = mongoose.model('Song', SongSchema);
