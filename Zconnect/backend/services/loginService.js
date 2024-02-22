const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class LoginService {
  async loginUser(email, password) {
    try {
      const user = await userRepository.findUserByEmail(email);

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

module.exports = new LoginService();
