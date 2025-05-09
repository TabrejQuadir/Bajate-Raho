const express = require('express');
const { createSong, getSongs, getSingleSong } = require('../controllers/songController');
const router = express.Router();
const upload = require('../middilware/multerConfig'); // Import the multer configuration

// Route to handle song creation with image and audio files
router.post('/songs', upload.fields([
  { name: 'audioFile', maxCount: 1 },  // For audio file
  { name: 'image', maxCount: 1 }       // For image file
]), createSong);

router.get('/songs', getSongs);
router.get('/songs/:id',getSingleSong);
module.exports = router;
