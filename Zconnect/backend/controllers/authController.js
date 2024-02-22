const authServices = require('../services/authServices');

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  try {
    if (!req.file) {
      throw new Error('Image is required!');
    }

    const imagePath = req.file.filename;

    await authServices.registerUser(username, email, password, imagePath);
    res.status(200).json({ message: 'Successful registration. Check email for verification.' });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

async function verifyEmail(req, res) {
    const { token } = req.params;
  
    try {
      const user = await authServices.verifyEmail(token);
      

res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

async function forgetPassword(req,res){
  
    const { email } = req.body;
  
    try {
      await authServices.forgetPassword(email);
      res.status(200).json({ message: 'Check your email for the password reset link. If you don\'t receive the email, please verify your email address.' }); 
    } catch (error) {
      res.status(400).json({ error: error.message });
    
  }
}

async function resetPassword(req, res) {
  try {
    const { verification_token } = req.params;
    const newPassword = req.body.newPassword;
    console.log(verification_token,newPassword);

    await authServices.resetPassword(verification_token, newPassword);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { registerUser,verifyEmail ,forgetPassword , resetPassword};
