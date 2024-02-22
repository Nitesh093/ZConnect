const  express= require("express")
const app=express()
require('dotenv').config()
const PORT=process.env.PORT
const db=require("./db/db")
const authRoutes=require("./routes/authRoutes")
const loginRoutes=require("./routes/loginRoutes")


app.use(express.json());


app.use('/api',authRoutes,loginRoutes);



app.listen(PORT,()=>{ 
    console.log(`app is running on port ${PORT}`)
})