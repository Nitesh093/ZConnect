const ChatEvents = require("../Helpers/constant");
const jwt = require('jsonwebtoken');
const Chat =require('../Chat/models/chatModel');
const chatRepository = require('../Chat/chat.repository');
const { json } = require("express");

class HandshakeSocket {
    constructor(io) {
        this.io = io;
        this.userSocketMap = new Map();

        this.initializeSocket();
    }

    initializeSocket() {
        this.io.on("connection", async (socket) => {
            console.log("This is socket", socket.id);

            try {
                // parse the cookies from the handshake headers (This is only possible if the client has `withCredentials: true`)
                let token = socket.handshake.headers.authorization;
                // get the accessToken
                console.log("Token we have: ", token);

                if (!token) {
                    console.log("I am connected but not JWT token");
                    // Check inside the handshake auth
                    token = socket.handshake.auth?.token;
                }

                if (!token) {
                    console.log("I am connected but not JWT handshake");
                    // Token is required for the socket to work
                    throw new ApiError(401, "Un-authorized handshake. Token is missing");
                }

                const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // decode the token
                const userId = decodedToken.userId;
                
                // retrieve the user
                if (!userId) {
                    throw new ApiError(401, "Un-authorized handshake. Token is invalid");
                }

                // Check if the user already has socket IDs associated
                console.log("mera type",typeof userId)
                const existingSocketIds = this.userSocketMap.get(userId) || [];

                // Add the new socket ID to the array of user's socket IDs
                existingSocketIds.push(socket.id);
                this.userSocketMap.set(userId, existingSocketIds);

                socket.userId = userId; // mount the user object to the socket

                socket.emit(ChatEvents.CONNECTED_EVENT); // emit the connected event so that the client is aware
                console.log("User connected. userId: ", userId);

                // Common events that need to be mounted on initialization
                this.userSocketMap.get(userId).forEach(socketId => {
                    this.io.to(socketId).emit(ChatEvents.CONNECTED_EVENT, `  ${userId} ---> ${socket.id}`);
                });
                console.log(this.userSocketMap)
                // Attach the message event handler
                this.handleMessageEvent(socket,this.userSocketMap);

                socket.on(ChatEvents.DISCONNECT_EVENT, () => {
                    console.log("User has disconnected. userId: " + socket.userId, socket.id);
                    if (socket.userId) {
                        console.log("Leaving room for userId: " + socket.userId);

                        // Remove the disconnected socket ID from the array
                        const updatedSocketIds = this.userSocketMap.get(socket.userId).filter(id => id !== socket.id);

                        // Update the map with the new array of socket IDs
                        this.userSocketMap.set(socket.userId, updatedSocketIds);

                        // Log the updated map
                        console.log('User Socket Map:', Array.from(this.userSocketMap));
                    }
                });
            } catch (error) {
                socket.emit(
                    ChatEvents.SOCKET_ERROR_EVENT,
                    error?.message || "Something went wrong while connecting to the socket."
                );
            }
        });
    }

    handleMessageEvent(socket,userSocketMap) {
        socket.on(ChatEvents.NEW_MESSAGE_SEND, async (data) => {
            console.log("userSocketMap",userSocketMap)
            try {
                const {content,chat,sender } = JSON.parse(data);
                
                if (!content || !chat || !sender) {
                    throw new ApiError(400, "Invalid message data");
                }
               
                // Find the chat and retrieve the users
                const chatData = await Chat.findById(chat);
                console.log(chatData)
                const usersInChat = chatData ? chatData.users : [];
                console.log(usersInChat)
                const usersInChatStr = usersInChat.map(objectId => objectId.toString());

            // Now usersInChat contains an array of string representations of ObjectId because map userid having string
                console.log(usersInChatStr);
                
                if (!usersInChatStr || usersInChatStr.length === 0) {
                    throw new ApiError(400, "No users found in the specified chat");
                }

                // Iterate through the users and send the message to all their sockets
                
                usersInChatStr.forEach(async (userId) => {
                    const userSocketIds = userSocketMap.get(userId) ;
                    for (const socketId of userSocketIds) {
                        console.log(`This is message socket ${socketId}`);
                        await this.io.to(socketId).emit(ChatEvents.NEW_MESSAGE_RECEIVE, { sender, content, chat });

                    }
                });
                await chatRepository.sendMessage(chat ,sender ,content)
 
                console.log(`Message broadcasted to chatId ${chat} by userId ${sender}`);
            } catch (error) {
                socket.emit(
                    ChatEvents.SOCKET_ERROR_EVENT,
                    error?.message || "Something went wrong while handling the message event."
                );
            }
        });
    }
}

module.exports = HandshakeSocket;
