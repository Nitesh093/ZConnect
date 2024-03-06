const ChatEvents = require("../Helpers/constant");
const jwt = require('jsonwebtoken');

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
                const existingSocketIds = this.userSocketMap.get(userId) || [];

                // Add the new socket ID to the array of user's socket IDs
                existingSocketIds.push(socket.id);
                this.userSocketMap.set(userId, existingSocketIds);

                socket.userId = userId; // mount the user object to the socket

                socket.emit(ChatEvents.CONNECTED_EVENT); // emit the connected event so that the client is aware
                console.log("User connected. userId: ", userId);

                // Common events that need to be mounted on the initialization
                this.userSocketMap.get(userId).forEach(socketId => {
                    this.io.to(socketId).emit('joined', `${socketId} ---> ${userId}`);
                });

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
}

module.exports = HandshakeSocket;

































































































// const ChatEvents = require("../Helpers/constant")
// const jwt = require('jsonwebtoken');


// const HandshakeSocket = (io) => {
//     return io.on("connection", async (socket) => {
//         console.log("this is socket",socket.id)
//         // console.log("socket headers",socket.handshake)
//       try {
        
//         // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
//         const token =socket.handshake.headers.authorization ;
//         // get the accessToken
//           console.log("token we have ",token)
//         if (!token) {
//             console.log("i am connected but not jwt token")
//           // Check inside the handshake auth
//           token = socket.handshake.auth?.token;
//         }
  
//         if (!token) {
//             console.log("i am connected but not jwt handhske")
//           // Token is required for the socket to work
//           throw new ApiError(401, "Un-authorized handshake. Token is missing");
//         }
//         ; 
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // decode the token
//         const userId=decodedToken.userId
        
  
//         // retrieve the user
//         if (!userId) {
//           throw new ApiError(401, "Un-authorized handshake. Token is invalid");
//         }
//         socket.userId = userId; // mount te user object to the socket
//         console.log("userID",userId)
//         // We are creating a room with user id so that if user is joined but does not have any active chat going on.
//         // still we want to emit some socket events to the user.
//         // so that the client can catch the event and show the notifications.
//         socket.join(userId);
//         socket.emit(ChatEvents.CONNECTED_EVENT); // emit the connected event so that client is aware
//         console.log("User connected . userId: ", userId);
        
//         io.to(userId).emit("joined",`joined with ${socket.id} --> ${socket.userId}`)
//         // Common events that needs to be mounted on the initialization
        
   
//         socket.on(ChatEvents.DISCONNECT_EVENT, () => {
//           console.log("User has disconnected . userId: " + socket.userId, socket.id);
//           if (socket.userId) {
//             console.log("Leaving room for userId: " + socket.userId);
            
//             // Leaving the room associated with the userId
//             io.to(socket.userId).emit('userDisconnected',`disconnect with ${socket.id} --> ${socket.userId}` );
//             socket.leave(socket.userId);
            
//           }
//         });
//       } catch (error) {
//         socket.emit(
//             ChatEvents.SOCKET_ERROR_EVENT,
//           error?.message || "Something went wrong while connecting to the socket."
//         );
//       }
//     });
//   };


// module.exports=HandshakeSocket;