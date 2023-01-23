const express=require("express");
const shortid = require('shortid');
const slugify=require('slugify')
const sendToken=require ('../utils/jwtToken')
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController");
const {getAllProducts,createProduct, updateProduct, deleteProduct, getProductsDetails, createProductReviews, getProductReviews, deleteReview, UploadProduct, getProducts, pro}=require('../controller/productController');
const { user, loginUser, logout, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser, registerUser, requireSignin } = require("../controller/userController");
const {auth,authorizeRoles}=require('../middleware/auth')
const router=express.Router();
const User=require ('../models/userSchema')
const multer=require ('multer');
const mongoose=require('mongoose')
const Product=require ('../models/productsModel');
const { signup, signin } = require("../controller/newUser");
const P=require('../models/newP.Schema')
// router.route('/products').get(getProducts);
// router.route('/products').get(pro);


router.route('/products').get(getAllProducts);
// router.route('/product/new').post(createProduct)
router.route('/product/:id').put(updateProduct)
.delete(deleteProduct)
router.route('/products/:id').get(getProductsDetails)
router.route('/reviews').get(getProductReviews).delete(auth,deleteReview)
//user routes
// router.route('/signup').post(registerUser)
// router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)
// router.route('/signin').post(signin)
router.route('admin/signup').post(signup)
router.route('admin/signin').post(signin)
router.route('/logout').get(logout)
router.route('/me').get(auth, getUserDetails)
router.route('/password/update').put(auth,updatePassword)
router.route('/me/update').put(auth,updateProfile)
router.route('/admin/users').get(auth,authorizeRoles('admin'),getAllUsers)
router.route('/admin/user/:id').get(auth,authorizeRoles('admin'),getSingleUser)
.put(auth,authorizeRoles('admin'),updateUserRole)
.delete(auth,authorizeRoles('admin'),deleteUser)
router.route('/review').put(auth,createProductReviews)
//order routes
router.route('/order/new').post(auth,newOrder)
router.route('/order/:id').get(auth,authorizeRoles('admin'),getSingleOrder)
router.route('/orders/me').get(auth,myOrders)
router.route('/admin/orders').get(auth,authorizeRoles('admin'),getAllOrders);
router.route('/admin/order/:id').put(auth,authorizeRoles('admin'),updateOrder)
.delete(auth,authorizeRoles('admin'),deleteOrder);

const upload=multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, 'uploads')
             
            },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        },})});
        router.post('/product/create',upload.array('productPictures'),
        async(req,res)=>{
        //   console.log({file:req.files,body:req.body})
        const{name,price,description,category,stock}=req.body;
        let productPictures=[];
        if (req.files.length>0){
            productPictures=req.files.map(file=>{
    // req.files.forEach(element => {
    //             img:element.filename
                return{img:file.filename }         
                
            })
        }
        const products=new Product({
            name:name,
            slug:slugify(name),
            price,
            stock,
            description,
            productPictures,
            category,
        })
await products.save()
res.json({products})
        })
    
        router.post('/user/create',upload.array('userProfile'),
        async(req,res)=>{
        //   console.log({file:req.files,body:req.body})
        const{name,email,password,phonenumber,username}=req.body;
        let userProfile=[];
        if (req.files.length>0){
            userProfile=req.files.map(file=>{
        // req.files.forEach(element => {
        //             img:element.filename
                return{img:file.filename }         
                
            })
        }
        const user1=new User({
            name,email,password,phonenumber,username,userProfile
        })
        
       
        await user1.save()
        sendToken(user1,201,res)
        // res.json({user1})

        })
        
        

module.exports=router


