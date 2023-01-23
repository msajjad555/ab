const express=require("express");
const router=express.Router()
const multer=require ('multer');
const Banner = require("../models/bannerModel");

const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },})});
        router.post("/banner",upload.single("file"),async (req,res)=>{
          res.send("file uploaded")
          const img= new Banner({
            file:req.file.originalname,
            name:req.body.name,
    
  
          })
          await img.save();
        })
        router.get('/banner',async(req,res)=>{
const banner=await Banner.find().limit(4)
res.json({banner})
        })
        module.exports=router