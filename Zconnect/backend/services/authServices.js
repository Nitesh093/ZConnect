const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository.js');
const EmailService=require('./emailServices.js')


class AuthServices{
  async registerUser(username, email, password, image) {
    try {
      const existingEmailUser = await userRepository.findUserByEmail(email);
      const existingUsernameUser = await userRepository.findUserByUsername(username);

      if (existingEmailUser || existingUsernameUser) {
        throw new Error('Email or username already registered');
      }
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userRepository.createUser(username, email, hashedPassword, image,verificationToken);

      // Send verification email
      await EmailService.sendVerificationEmail(user.email, user.verificationToken);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      const user = await userRepository.findUserByToken(token);

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
      const user = await userRepository.findUserByEmail(email);

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
      const user = await userRepository.findUserByToken(verification_token);

      if (!user || user.verificationToken !== verification_token ) {
        throw new Error('Invalid or expired reset token');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update the password and clear the reset token
      user.password = hashedPassword;
      user.verificationToken = undefined;
      user.verificationToken = undefined;

      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthServices();
