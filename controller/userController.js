const mongoose=require ('mongoose')
const express=require('express')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User=require ('../models/userSchema')
const sendToken = require('../utils/jwtToken')
const cloudinary=require('cloudinary')
const ErrorHander=require ('../utils/errorhander')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const jwt=require('jsonwebtoken')
// exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
//     const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
//         folder:'avatars',
//         width:150,
//         crop:'scale'
//     })
// const {name,email,password,username,phone}=req.body
// const user =await User.create({
//     name , email , password,username,phone
//     // avatar:{
//     //     public_id:myCloud.public_id,
//     //     url:myCloud.secure_url
//     // }
// });

// sendToken(user,201,res)
// })

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  const sellopoint=await user.getJWTToken();
//   console.log(sellopoint);
res.cookie('jwtoken',sellopoint,{
    expires:new Date(Date.now()+25892000000),
    httpOnly:true,
})
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  res.json({user})
    // sendToken(user, 200, res);
  });
exports.logout=async(req,res,next)=>{

    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
   
    res.status(200).json({
        success:true,
        message:'logged out'
    })
}
exports.getUserDetails=async (req,res,next)=>{
const user=await User.findById(req.user.id)
res.status(200).json({
    success:true,
    user,
})
}
exports.updatePassword=async(req,res)=>{
    const user=await User.findById(req.user.id)
const isPasswordMatched=await user.comparePassword(req.body.oldpassword)
if(!isPasswordMatched){
    return next('invalid password')
}
user.password=req.body.newPassword;
await user.save()
    res.status(200).json({
    success:true,
    user,
})
}
exports.updateProfile=async(req,res)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }
    //we will add cloudinary
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({
        success:true,
    })
}
//get all users(admin)
exports.getAllUsers=async(req,res)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
}
//get single users(admin)
exports.getSingleUser=async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next({message:`user does not exist with id:${req.params.id}`})
    }
    res.status(200).json({
        success:true,
        user
    })
}
//update user role--admin
exports.updateProfile=async(req,res)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    //we will add cloudinary
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({ 
        success:true,
    })
}
//delete user ---admin
exports.deleteUser=async(req,res)=>{
const user=await User.findById(req.params.id)
    //we will add cloudinary
    if(!user){
        return next('user does not exist')
    }
    await user.remove()
    res.status(200).json({
        success:true,
    })
}

//update user ---admin
exports.updateUserRole=async(req,res)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    //we will add cloudinary
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })
    res.status(200).json({ 
        success:true,
    })
}
exports.requireSignin=(req,res,next)=>{
const token=req.headers.authorization.split(" ")[1];
const user=jwt.verify(token,process.env.JWT_SECRET)
req.user=user
next();

}