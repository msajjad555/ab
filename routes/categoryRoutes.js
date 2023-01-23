const express=require("express");
const slugify=require('slugify')
const shortid=require('shortid')
const router=express.Router()
const multer=require ('multer');
const { category, getCategory, postCategory } = require("../controller/categoryController");
const Category = require("../models/Category");
const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads')
             
            },
        filename:(req,file,cb)=>{
            cb(null,shortid.generate()+'-'+file.originalname);
        },})});
        // router.route("/category/create",upload.single("categoryImage")).post(postCategory)
        
        router.post('/category/create',upload.single("categoryImage"),(req,res)=>{
            const categoryObj={
                name:req.body.name,
                slug:slugify(req.body.name),
                file:req.file.filename
             
            }
            if(req.file){
                categoryObj.categoryImage=process.env.API+'/uploads/'+req.file.filename;
            }
            if(req.body.parentId){
                categoryObj.parentId=req.body.parentId
            }
            const cat=new Category(categoryObj);
            cat.save((eror,category)=>{
                if(category){
                    return res.status(201).json({category})
                }
            })
        
        const createCategories=(categories,parentId=null)=>{
        let categoryList=[];
        let category;
        if(parentId===null){
            category=categories.filter(cat=>cat.parentId==undefined);
        }else{
            category=categories.filter(cat=>cat.parentId==parentId);
        }
        for(let cate of category){
            categoryList.push({
                _id:cate._id,
                name:cate.name,
                slug:cate.slug,
                children:createCategories(categories, cate._id)
            })
        }
        return categoryList;
        }
        })
     



// router.route('/category/create').post(category)
router.route('/category/getcategory').get(getCategory)
module.exports=router