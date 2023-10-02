require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ['jpg', 'png', 'jpeg'],
  params: {
    folder: 'cloudImageWebNodejs',
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Not an image!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 200 * 1024
  }
});

module.exports = {
  uploadImg,
};