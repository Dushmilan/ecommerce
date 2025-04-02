const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    // Get the timestamp and clean the original filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cleanFilename = file.originalname
      .replace(/[^a-zA-Z0-9.]/g, '-') // Replace special characters with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single one
      .trim('-'); // Remove leading/trailing hyphens

    cb(null, `${timestamp}-${cleanFilename}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
