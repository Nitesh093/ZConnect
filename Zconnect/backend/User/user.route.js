const express = require('express');
const {jwtMiddleware} = require('../middleware/jwtMiddleware');
const userController = require('./user.controller');

const router = express.Router();

router.get('/user', jwtMiddleware, userController.searchUser);


module.exports = router;
 