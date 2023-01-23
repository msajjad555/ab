const express=require("express");
const router=express.Router()
const Multer=require ('../models/multerArray')
const multer=require ('multer');
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },})});
        router.post('/products',upload.array('files',2),async(req,res)=>{
           console.log(req.files);
            let result=new Multer({
                image:req.files
            })
            await result.save()
        })
    
        module.exports=router