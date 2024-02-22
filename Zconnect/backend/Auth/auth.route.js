const express = require('express');
const AuthController = require('./auth.controller');
const upload = require('../middleware/multerMiddleware');

class AuthRoutes {
  constructor(authController, uploadMiddleware) {
    this.router = express.Router();
    this.authController = authController;
    this.uploadMiddleware = uploadMiddleware;

    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/register', this.uploadMiddleware.single('image'), this.authController.registerUser);
    this.router.get('/verify-email/:token', this.authController.verifyEmail);
    this.router.post('/forgot-password', this.authController.forgetPassword);
    this.router.post('/reset-password/:verification_token', this.authController.resetPassword);
    this.router.post('/login', this.authController.loginUser);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new AuthRoutes(AuthController, upload).getRouter();
