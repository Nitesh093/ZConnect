const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const UserRepository = require('../User/user.repository.js');
const EmailService = require('../Email-verification/emailServices.js');
const jwt = require('jsonwebtoken');

class AuthService {
  async registerUser(username, email, password, image) {
    try {
      const existingEmailUser = await UserRepository.findUserByEmail(email);
      const existingUsernameUser = await UserRepository.findUserByUsername(username);

      if (existingEmailUser || existingUsernameUser) {
        throw new Error('Email or username already registered');
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.createUser(username, email, hashedPassword, image, verificationToken);

      // Send verification email
      await EmailService.sendVerificationEmail(user.email, user.verificationToken);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      const user = await UserRepository.findUserByToken(token);

      if (!user) {
        throw new Error('Invalid verification token');
      }

      // Update user status to Active
      user.status = 'Active';
      user.verificationToken = undefined;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(email) {
    try {
      const user = await UserRepository.findUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.verificationToken = resetToken;

      await user.save();

      // Send password reset email
      await EmailService.sendResetPasswordEmail(user.email, user.verificationToken);

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(verification_token, newPassword) {
    try {
      const user = await UserRepository.findUserByToken(verification_token);

      if (!user || user.verificationToken !== verification_token) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update the password and clear the reset token
      user.password = hashedPassword;
      user.verificationToken = undefined;

      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await UserRepository.findUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user);
      const expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // You can adjust the expiration time

      return { token, expires_in: expiresIn };
    } catch (error) {
      throw error;
    }
  }

  generateToken(user) {
    const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const payload = {
      userId: user._id,
      email: user.email
      // Add more claims as needed
    };

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}

module.exports = new AuthService();
