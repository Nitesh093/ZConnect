const Chat = require('./models/chatModel');
const Message=require('./models/messageModel')

class ChatRepository {
  async createChat(chatName, users, isGroup, admin, currentUserId) {
    try {
      // Check if a chat with the same name and current user already exists
      const existingChat = await Chat.findOne({
        chatName,
        users: { $ne: currentUserId }, // Check that currentUserId is not in the users array
      });

      if (existingChat) {
        // If the current user is not in the chat, return the existing chat
        return existingChat;
      }

      // Create a new chat if it doesn't exist
      const chat = new Chat({
        chatName,
        users,
        isGroup,
        admin,
      });

      await chat.save();

      return chat;
    } catch (error) {
      throw error;
    }
  }
  async addMemberToChat(chatId, userToAdd, currentUserId) {
    try {
      console.log(chatId ,"chatid" ,userToAdd ,currentUserId)
      const chat = await Chat.findById(chatId);
      
  
      if (!chat) {
        throw { name: 'NotFoundError' };
      }
      
  
      if (!chat.users.includes(currentUserId) || !chat.admin.equals(currentUserId)) {
        throw { name: 'UnauthorizedError' };
      }
  
      const existingUsers = chat.users;
      const newUsers = [...new Set([...existingUsers, ...userToAdd])]; // Add only unique users
      console.log(newUsers)
      if (newUsers.length === existingUsers.length) {
        throw { name: 'BadRequestError' }; // No new users added
      }
  
      chat.users = newUsers;
      await chat.save();
  
      return { message: 'Member added successfully' };
    } catch (error) {
      throw error;
    }
  }
  async  removeMemberFromChat(chatId, userToRemove, currentUserId) {
    try {
      const chat = await Chat.findById(chatId);
      console.log(currentUserId)
      console.log(chat.users)
  
      if (!chat) {
        throw { name: 'NotFoundError' };
      }
      console.log(chat.users.includes(currentUserId),chat.admin.equals(currentUserId))
      if (!chat.users.includes(currentUserId) || !chat.admin.equals(currentUserId)) {
        
        throw { name: 'UnauthorizedError' };
        
      }
  
      
      const existingUsers = chat.users.map(userId => userId.toString());
      const userToRemoveStrings = userToRemove.map(userId => userId.toString());
      const newUsers = existingUsers.filter(userId => !userToRemove.includes(userId));
      
      if (newUsers.length === existingUsers.length) {
        throw { name: 'BadRequestError' }; // No users removed
      }
  
      chat.users = newUsers;
      await chat.save();
  
      return { message: 'User removed successfully' };
    } catch (error) {
      throw error;
    }
  }
  async  getChats(currentUserId) {
    try {
      // Customize this query based on your data model and requirements
      console.log(currentUserId)
      const chats = await Chat.find({ users: currentUserId }).populate('users', 'username image').exec();
      return chats;
    } catch (error) {
      throw error;
    }
  }
  async  getMessagesForChat(chatId, currentUserId) {
    try {
      const chat = await Chat.findById(chatId);
  
      if (!chat || !chat.users.includes(currentUserId)) {
        throw { name: 'UnauthorizedError' };
      }
  
      // Customize this query based on your data model and requirements
      const messages = await Message.find({ chat: chatId }).sort({ createdAt: 'asc' }).exec();
      
      return messages;
    } catch (error) {
      throw error;
    }
  }
  async  sendMessage(chatId, sender, content) {
    try {
      
      const chat = await Chat.findById(chatId);
  
      if (!chat || !chat.users.includes(sender)) {
        throw { name: 'UnauthorizedError' };
      }
      console.log(chat,sender,content)
      const message = new Message({
        content,
        chat,
        sender
      });
  
      await message.save();
  
      // Update the latestMessage field in the chat
      chat.latestMessage = message._id;
      await chat.save();
  
      return message;
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = new ChatRepository();
