const loginService = require('../services/loginService');

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const tokenData = await loginService.loginUser(email, password);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { loginUser };
