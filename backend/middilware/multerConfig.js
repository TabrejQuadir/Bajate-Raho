const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spotify_app/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => 'img_' + Date.now() + path.extname(file.originalname),
  },
});

// ✅ Storage for audio
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spotify_app/audio',
    resource_type: 'video', // Cloudinary handles audio under 'video'
    allowed_formats: ['mp3', 'wav', 'flac'],
    public_id: (req, file) => 'audio_' + Date.now() + path.extname(file.originalname),
  },
});

// ✅ Combined storage that handles both image and audio
const combinedStorage = {
  _handleFile: (req, file, cb) => {
    if (file.fieldname === 'image') {
      imageStorage._handleFile(req, file, cb);
    } else if (file.fieldname === 'audioFile') {
      audioStorage._handleFile(req, file, cb);
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  _removeFile: (req, file, cb) => {
    if (file.fieldname === 'image') {
      imageStorage._removeFile(req, file, cb);
    } else if (file.fieldname === 'audioFile') {
      audioStorage._removeFile(req, file, cb);
    } else {
      cb(new Error('Invalid fieldname'));
    }
  }
};

// ✅ File filter to validate MIME type & extension
const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'image') {
    const imageTypes = /jpeg|jpg|png|gif/;
    if (imageTypes.test(extname) && imageTypes.test(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid image file type. Only images are allowed.'));
    }
  }

  if (file.fieldname === 'audioFile') {
    const allowedAudio = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.flac': 'audio/flac',
    };
    if (allowedAudio[extname] && file.mimetype === allowedAudio[extname]) {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid audio file type. Only MP3, WAV, and FLAC are allowed.'));
    }
  }

  return cb(new Error('Invalid fieldname.')); // catch-all
};

// ✅ Create uploaders
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

const combinedUpload = multer({
  storage: combinedStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max for audio files
});

// ✅ Export both for combined or individual use
module.exports = {
  imageUpload,
  audioUpload,
  combinedUpload
};
