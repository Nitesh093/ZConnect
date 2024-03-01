const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY; // Change this to a secure secret key


const generateToken= (user) => {
    const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const payload = {
      userId: user._id,
      email: user.email
      
    };

    return jwt.sign(payload, secretKey, { expiresIn });
}


const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized - Token has expired' });
    }
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = {jwtMiddleware ,generateToken};
