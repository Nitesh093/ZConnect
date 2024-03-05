const mongoose = require('mongoose');
// const db=require("../../config/db")
const User = require('../../User/model/userModel')
const Chat =require('../models/chatModel')

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// const newMessage = new Message({
//   message: "i am good",
//   chat: "65e0741c8fdf9badd0c66fe5",
//   sender: "65e073a28fdf9badd0c66fe2",
// });

// // Save the message to the database
//  newMessage.save();

module.exports = Message;
