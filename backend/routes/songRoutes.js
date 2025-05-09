const express = require('express');
const { createSong, getSongs, getSingleSong } = require('../controllers/songController');
const router = express.Router();
const { combinedUpload } = require('../middilware/multerConfig');

// Route to handle song creation with image and audio files
router.post('/songs', 
  combinedUpload.fields([
    { name: 'image', maxCount: 1 },      // For image file
    { name: 'audioFile', maxCount: 1 }   // For audio file
  ]), 
  createSong
);

router.get('/songs', getSongs);
router.get('/songs/:id', getSingleSong);

module.exports = router;
