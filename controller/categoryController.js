const express=require ('express')
const Category=require ('../models/Category')
const slugify=require ('slugify')
const router=express.Router()

exports.postCategory=async(req,res)=>{
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
    cat.save((error,category)=>{
        if(category){
            return res.status(201).json({category})
        }
    })
};
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
        parentId:cate.parentId,
        slug:cate.slug,
        children:createCategories(categories, cate._id)
    })
}
return categoryList;
}
exports.getCategory=(req,res)=>{
Category.find({})
.populate('product')
.exec((error,categories)=>{
if(error) return res.status(400).json({error});

if(categories){
    const categoryList=createCategories(categories);

res.json({categoryList});
}
})}