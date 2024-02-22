const loginController = require('../controllers/loginController')
const express = require('express');
const router = express.Router();



router.post('/login', loginController.loginUser);

module.exports = router;
