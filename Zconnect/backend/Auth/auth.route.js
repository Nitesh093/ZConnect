const express = require('express');
const AuthController = require('./auth.controller');
const multerMiddleware = require('../middleware/multerMiddleware')

const router = express.Router();


router.post('/register', multerMiddleware, AuthController.registerUser);
router.get('/verify-email/:token', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgetPassword);
router.post('/reset-password/:verification_token', AuthController.resetPassword);
router.post('/login', AuthController.loginUser);

module.exports = router;
