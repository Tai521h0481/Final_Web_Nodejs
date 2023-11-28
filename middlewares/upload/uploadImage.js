const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// Storage for user avatar images
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cloudImageWebNodejs/avatar',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

// Storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cloudImageWebNodejs/piture_product',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

// Multer upload for avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter
});

// Multer upload for product images
const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFileFilter
});

// File filter function
function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Not an image!'), false);
  }
  cb(null, true);
}

module.exports = {
  uploadAvatar,
  uploadProductImage,
};
