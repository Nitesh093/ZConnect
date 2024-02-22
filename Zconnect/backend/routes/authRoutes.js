const express = require('express');
const authController = require('../controllers/authController');

const upload = require('../middleware/multerMiddleware');

const router = express.Router();

router.post('/register', upload.single('image'), authController.registerUser);
router.get('/verify-email/:token', authController.verifyEmail);


router.post('/forgot-password',authController.forgetPassword);
router.post('/reset-password/:verification_token',authController.resetPassword);

module.exports = router;
