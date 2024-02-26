// multerMiddleware.js
const multer = require('multer');
const cloudinary = require('../config/config.cloudinary'); // Adjust the path accordingly

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    }).end(fileBuffer);
  });
};

const multerMiddleware = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    try {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      req.imageUrl = imageUrl;
      next();
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

module.exports = multerMiddleware;
 