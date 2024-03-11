// chat.controller.js
const chatService = require('./chat.service');

class ChatController {
  async createChat(req, res) {
    
    const currentUserId =req.user.userId;

    try {
      const { chatName, users, isGroup, admin } = req.body;
      const chat = await chatService.createChat(chatName, users, isGroup, admin,currentUserId);
      res.status(201).json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    

  }
  async addMemberToChat(req, res) {
    try {
      const { chatId, userToAdd } = req.body;
      const currentUserId = req.user.userId;
      
  
      const result = await chatService.addMemberToChat(chatId, userToAdd, currentUserId);
  
      res.status(200).json(result);
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'You are not admin' });
      } else if (error.name === 'NotFoundError') {
        res.status(404).json({ error: 'Chat not found or user not in the chat' });
      } else if (error.name === 'BadRequestError') {
        res.status(400).json({ error: 'Invalid input or user already in the chat' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  async removeMemberFromChat(req, res) {
    try {
      const { chatId, userToRemove } = req.body;
      const currentUserId = req.user.userId;
  
      const result = await chatService.removeMemberFromChat(chatId, userToRemove, currentUserId);
  
      res.status(200).json(result);
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid or expired token' });
      } else if (error.name === 'NotFoundError') {
        res.status(404).json({ error: 'Chat not found or user not in the chat' });
      } else if (error.name === 'BadRequestError') {
        res.status(400).json({ error: 'Invalid input or user not in the chat' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  async  getChats(req, res) {
    try {
      const currentUserId = req.user.userId;
      const chats = await chatService.getChats(currentUserId);
  
      res.status(200).json(chats);
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid or expired token' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  async  getMessagesForChat(req, res) {
    try {
      const { chatId } = req.params;
      const currentUserId = req.user.userId;
  
      const messages = await chatService.getMessagesForChat(chatId, currentUserId);
      
  
      res.status(200).json(messages);
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid or expired token' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
  async  sendMessage(req, res) {
    // console.log(req.body)
    try {
      
      const {chat, sender, content } = req.body;
      // console.log(chat,sender,content)
  
      const message = await chatService.sendMessage(chat, sender, content);
  
      res.status(201).json(message);
    } catch (error) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid or expired token' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}

module.exports = new ChatController();
