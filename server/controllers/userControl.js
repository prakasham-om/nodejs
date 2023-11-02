import userModel from "../models/userModel.js";

import bcrypt from 'bcrypt';

import jwtToken from 'jsonwebtoken';

import dotenv from "dotenv"

import nodemailer from "nodemailer";

dotenv.config();



export const registerUser=async(req,res,next)=>{
    try{

      const {name,email,password,passwordChangeDate,role}=req.body;
      const existUser= await userModel.findOne({email});
      if(existUser){
        return res.status(400).json({   message:"user Email already exist" });
      }

      const newUser=new userModel({name,email,password,passwordChangeDate,role});
      console.log(newUser);

      
      await newUser.save();
      const jwtSecret=process.env.JWT_SECRET;
      const token=jwtToken.sign({id:userModel._id},jwtSecret,{expiresIn:'30d'})
      res.status(201).json({message:"user create success",result:{newUser,token}});
    }catch(err){
      return res.status(400).json({
        message:err.message
      })
    }
     
}


//login user 
export const loginUser=async(req,res,next)=>{
   try{
      const {email,password}=req.body;

      if(!email || !password){
         return res.status(400).json({message:"email and password required"});
      }

      const user=await userModel.findOne({email}).select('+password');
     // console.log(user);
      if(!user){
         return res.status(400).json({message:"user not found"});
      }


      const isMatchPassword=bcrypt.compare(password,user.password);
     // console.log(isMatchPassword)

      if(!isMatchPassword){
         res.status(400).json({message:"wrong password"})
      }
     const jwtSecret=process.env.JWT_SECRET;
     const token=jwtToken.sign({id:user._id},jwtSecret,{expiresIn:3600});
      
     res.status(200).json({message:"user successful login",result:{id:user._id,token}})
     next();
   
   }catch{
      return res.status(400).json({
        message:"Bad Request"
      })
   }
}




export const protectData=async(req,res,next)=>{
   // console.log(req.headers.authorization);
  
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    const token=req.headers.authorization.split(" ")[1];
    if(!token){
      return res.status(401).json({message:"unauthorized"})
    }

    console.log("token",token)

    jwtToken.verify(token,process.env.JWT_SECRET,async(err,decodedToken)=>{

      if(err){
        return res.status(401).json({message:"unauthorized user"})
      }
       console.log(decodedToken) 
    
     const user=await userModel.findById(decodedToken.id);
     console.log(user)
     if(!user){
      return res.status(401).json({message:"user of this id is not available"});
    }

    const passwordChangeVerify=await user.verifyPassword(decodedToken.iat);
    if(passwordChangeVerify){
      return res.status(401).json({message:"user's password is incorrect/changed"});
    }
    req.user=user;
    next();
    });
      
  }
  
  else{
    res.status(401).json({message:"unauthorized"})

  }
}


// export const deleteAccess = (role) =>(req,res,next)=> {
//   if(role !== req.user.role){
//     return res.status(401).json({message:"You don't have permission to delete"});
//   }
//   next();
// }


export const forgetPassword=async(req,res)=>{
  const email=req.body
  const user= await userModel.findOne(email)
  console.log(user);
  console.log(process.env.EMAIL,process.env.EMAIL_PASSWORD)
  if(!user){
    return res.status(400).json({message:"user not found"});
  }
  const token=jwtToken.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:3600});
  
  const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
      type:"login",
      user:process.env.EMAIL_FROM,
      pass:process.env.EMAIL_PASSWORD
    }

  })
   transporter.sendMail({
    from:process.env.EMAIL_FROM,
    to:user.email,
    subject:"Reset Password",
    html:`<h1>Hello ${user.name}</h1>
    <p>Please click on the link below to reset your password</p>
    <a href="http://localhost:3000/resetpassword/${token}">Reset Password</a>
    <p>Thanks</p>
    <p>please send random password ::</p>
    `
  },(err, res) => {

    if(err){
      console.log(err);
    }
    res.status(200).json({message:"password reset link send to your email"})
  }
    )
  





}


