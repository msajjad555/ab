const Products=require('../models/productsModel')
const Category = require("../models/Category")
const Banner=require('../models/bannerModel')
const mongoose=require('mongoose')
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
exports.initialData=async (req,res)=>{
    try {
        const categories=await Category.find({})
        // .populate('product').exec();
        const products=await Products.find({})
        .select('_id name price quanity slug discription productPictures countInStock category')
        .populate('category')
        // .populate({ path: 'category', select: 'name _id', model: Category } )// <--- specify the model explicitly
        .exec();
        res.json({
                     products,
            categories:createCategories(categories),
           
    
        })
    } 
  
    catch (error) {
        console.log(error);
    }
 
}