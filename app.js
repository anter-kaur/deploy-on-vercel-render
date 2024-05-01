const express=require('express')
const app=express();
const dotenv=require('dotenv')
const connect=require('./connection/connect')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const path = require("path");

const userRouter=require('./routes/userRoute')

dotenv.config()


app.use(express.json())

app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(cookieParser())

app.use('/api/user',userRouter)

connect();

app.get("/", (req, res) => {
app.use(express.static(path.resolve(__dirname, "frontend", "build")));
res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});
    

app.listen(process.env.PORT,()=>{
    console.log(`Server running at port ${process.env.PORT}`)
})