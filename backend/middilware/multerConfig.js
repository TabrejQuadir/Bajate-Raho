const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'audioFile') {
      cb(null, 'uploads/audio'); // Directory for audio files
    } else if (file.fieldname === 'image') {
      cb(null, 'uploads/images'); // Directory for image files
    }
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname); // Name the file based on the current timestamp
    cb(null, fileName);
  }
});

// Set up file filter for images and audio files
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif/; // Allowed image file types
  const audioTypes = /audio\/(mp3|mpeg|wav|flac)/; // Allowed audio file types

  console.log('File MIME Type:', file.mimetype);  // Log MIME type to check it
  console.log('Audio file extension:', path.extname(file.originalname)); // Log the file extension

  if (file.fieldname === 'image') {
    // Check if the file is an image
    const extname = imageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true); // Accept the image file
    } else {
      return cb('Error: Invalid image file type. Only images are allowed!');
    }
  } else if (file.fieldname === 'audioFile') {
    // Check if the file is an audio file
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Ensure both extension and MIME type are valid
    if (
      (extname === '.mp3' && mimetype === 'audio/mpeg') ||
      (extname === '.wav' && mimetype === 'audio/wav') ||
      (extname === '.flac' && mimetype === 'audio/flac')
    ) {
      return cb(null, true); // Accept audio file
    } else {
      return cb('Error: Invalid audio file type. Only audio files are allowed!');
    }
  }
};

// Configure multer to handle multiple files (image and audio)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

module.exports = upload;
