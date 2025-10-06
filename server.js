require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const userRouter = require("./Routes/userRouter")
const eventRouter = require("./Routes/eventRouter")


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
const allowedOrigins = [
    "http://localhost:5173/",
    "https://mb-events-indol.vercel.app/"
]
app.use(cors({
    origin : (origin,callback)=>{
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null,true)  
        }else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials : true
}))

//test route
app.get("/",(req,res)=>{
    res.status(200).json({success: true, message: "MB events server"})
});
app.use("/api/user" , userRouter)
app.use("/api/user/events", eventRouter)
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MoongoDB connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port: ${process.env.PORT}`);
            
        })
        
    } catch (error) {
        console.log(error);
    }
}
startServer()

//error route
app.use((req,res)=>{
     res.status(401).json({success: false, messsage: "ROUTE NOT FOUND"})
})