const mongoose=require('mongoose')
const User = require('../../User/model/userModel')


const chatschema = new mongoose.Schema({
    users:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref : User ,
        required: true 
    }],
    chatName:{
        type:String,
        required:true
    },
    isGroup:{
        type:Boolean,
        default: false
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
})

const Chat=mongoose.model('Chat',chatschema);



module.exports=Chat;