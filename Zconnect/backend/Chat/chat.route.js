const express = require('express');
const router = express.Router();
const ChatController = require('./chat.controller');
const {jwtMiddleware} = require('../middleware/jwtMiddleware')


router.post('/create', jwtMiddleware, ChatController.createChat);
router.post('/add-member', jwtMiddleware, ChatController.addMemberToChat);
router.post('/remove-member', jwtMiddleware, ChatController.removeMemberFromChat);
router.get('/', jwtMiddleware, ChatController.getChats);
router.get('/:chatId', jwtMiddleware, ChatController.getMessagesForChat);
router.post('/:chatId', jwtMiddleware, ChatController.sendMessage);


module.exports = router;
 