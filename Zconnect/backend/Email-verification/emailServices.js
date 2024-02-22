// services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nitesh.zecotok@gmail.com',
        pass: "qyzx pubt xsgy vevi",
      },
    });
  }

  sendVerificationEmail(email, verificationToken) {
    const mailOptions = {
      from: 'nitesh.zecotok@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Thank you for signing up!</p>
        <p>Click on the following link to verify your email:</p>
        <a href=" http://localhost:5000/api/verify-email/${verificationToken}">Verify Email</a>
      `,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  sendResetPasswordEmail(email, resetToken) {
    const mailOptions = {
      from: 'nitesh.zecotok@gmail.com',
      to: email,
      subject: 'Reset Password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5000/api/reset-password/${resetToken}">Reset Password</a>
      `,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = new EmailService();
