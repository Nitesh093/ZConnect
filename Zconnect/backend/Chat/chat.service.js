const chatRepository = require('./chat.repository');

class ChatService {
  async createChat(chatName, users, isGroup, admin,currentUserId) {
    try {
      const chat = await chatRepository.createChat(chatName, users, isGroup, admin,currentUserId);
      return chat;
    } catch (error) {
      throw error;
    }
  }
  async addMemberToChat(chatId, userToAdd, currentUserId) {
    try {
      const result = await chatRepository.addMemberToChat(chatId, userToAdd, currentUserId);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async removeMemberFromChat(chatId, userToRemove, currentUserId) {
    try {
      const result = await chatRepository.removeMemberFromChat(chatId, userToRemove, currentUserId);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async  getChats(currentUserId) {
    try {
      const chats = await chatRepository.getChats(currentUserId);
      
      return chats;
    } catch (error) {
      throw error;
    }
  }
  async  getMessagesForChat(chatId, currentUserId) {
    try {
      const messages = await chatRepository.getMessagesForChat(chatId, currentUserId);
      // You can format the response or perform additional processing if needed
      return messages;
    } catch (error) {
      throw error;
    }
  }
  async  sendMessage(chat, sender, content) {
    try {
      const message = await chatRepository.sendMessage(chat, sender, content);
      // You can format the response or perform additional processing if needed
      return message;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ChatService();
