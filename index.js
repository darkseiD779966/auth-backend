const express =require("express");
const  cors= require("cors");
const mongoose =require("mongoose");
const User =require('./User.js')
const bcrypt=require('bcrypt');
const app=express();
const jwt = require('jsonwebtoken');
const bcryptSalt=bcrypt.genSaltSync(10);
jwtSecret='asdasdasd';
require("dotenv").config()
app.use(express.json());
app.use(cors({
    Credential:true,
    origin:"http://127.0.0.1:5173",
}));


mongoose.connect(process.env.MONGO_URL);

app.get("/test",(req,res)=>{
    res.json("test ok");
});

app.post('/register',async(req,res)=>{
const {name,email,password} =req.body;
  
try{
const userDoc=await User.create({
    name,
    email,
    password:bcrypt.hashSync(password,bcryptSalt),
});

res.json(userDoc);
}catch(e){
res.status(422).json(e);
}
});

app.post('/login',async(req,res)=>{
    const{email,password}=req.body;

    const userDoc=await User.findOne({email});
if(userDoc){
const passOk =bcrypt.compareSync(password,userDoc.password)

if(passOk){
    jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
if(err) throw err;
res.cookie('token',token).json("password is correct");
    });
   
}else{
    res.status(422).json("password is incorrect");
}
}else{
    res.status(404).json("user not found");
}
});


app.listen(4000); 