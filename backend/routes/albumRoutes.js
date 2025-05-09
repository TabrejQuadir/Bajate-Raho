// routes/albumRoutes.js
const express = require('express');
const { createAlbum, getAlbums, getAlbumById } = require('../controllers/albumController');
const upload = require('../middilware/multerConfig');

const router = express.Router();

router.post('/albums', upload.single('image'), createAlbum); 
router.get('/albums', getAlbums);
router.get('/albums/:id', getAlbumById);

module.exports = router;
