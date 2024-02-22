const  express= require("express")
const app=express()
require('dotenv').config()
const PORT=process.env.PORT
const db=require("./config/db")
const authRoutes=require("./Auth/auth.route")



app.use(express.json());


app.use('/api',authRoutes);



app.listen(PORT,()=>{ 
    console.log(`app is running on port ${PORT}`)
})