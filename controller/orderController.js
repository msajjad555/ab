const Order=require ('../models/orderSchema')
const Product=require ('../models/productSchema')
const ErrorHander=require('../utils/errorhander')
const catchAsyncError=require('../middleware/catchAsyncErrors')
const { findById } = require('../models/orderSchema')
//create new order user
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,oderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body
        const order=await Order.create({

            shippingInfo,oderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,
            paidAt:Date.now(),user:req.user._id,

        })
        res.status(200).json({
            success:true,
            order
        })
})
// get single order
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate('user','mame email');
    if(!order){
        return next(new ErrorHander('order not found with id',404))
    }
    res.status(200).json({
        success:true,
        order
    })
    
})
// get loged in user
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById({user:req.user._id})
    res.status(200).json({
        success:true,
        order
    })
    
})
//get all orders
exports.getAllOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
    
})
// update order status

exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
  if(order.orderStatus==='delivered'){
    return next(new ErrorHander('you have already delivred this item',404))
  }
order.orderItems.forEach(async(order)=>{
     await updateStock(order.product,order.quantity)
})
  order.orderStatus===req.body.status;
  if(req.body.status==='Delivered'){
    order.deliveredAt=Date.now();
  }
  await order.save({
    validateBeforeSave:flase,  })
    res.status(200).json({
        success:true,
        totalAmount,
       })
  
  });
  async function updateStock(id,quantity){
    const product=await findById(id)
    product.stock-=quantity;
    await product.save({validateBeforeSave:false})
    }
  
 
    //delete order--admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

 
    if(!order){
        return next(new ErrorHander('order not found with id',404))
    } 
    await order.remove()
    res.status(200).json({
        success:true,
        totalAmount,
        
    })
})

