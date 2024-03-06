const  express= require("express")
const app=express()
require('dotenv').config()
const PORT=process.env.PORT
const db=require("./config/db")
const http=require('http').Server(app)
const io=require('socket.io')(http)
const HandshakeSocket=require('./Socket/socket')


const authRoutes=require("./Auth/auth.route")
const userRoutes=require("./User/user.route")
const chatRoutes=require("./Chat/chat.route")

app.use(express.json());

app.use('/api',authRoutes,userRoutes);
app.use('/api/chat',chatRoutes)

const handshakeSocket = new HandshakeSocket(io);

app.set("io", io); //for global use


 


http.listen(PORT,()=>{ 
    console.log(`app is running on port ${PORT}`)
})