const express=require('express');
const Product=require('./models/productsModel')
const mongoose = require ('mongoose');
const cors=require ('cors')
const slugify=require ('slugify')
const dotenv=require('dotenv')
const DB=require('./database/database')
const cloudinary=require ('cloudinary')
const productsRouter = require('./routes/productRoutes');
const categoryRoutes=require('./routes/categoryRoutes')
const bannerroutes=require('./routes/bannerRoutes')
const multerRoute=require('./routes/MulterArray')
const path=require('path')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser');
const { initialData } = require('./controller/initailData');
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/uploads',express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(categoryRoutes)
app.use(productsRouter)
app.use(multerRoute)
app.use(bannerroutes)
app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,"./frontend/build/index.html"))
})
app.post('/ini',initialData)
dotenv.config({path:'config/config.env'})
DB();

// app.get('/search/:key',async(req,res)=>{
//     let result=await Product.find({
//         "$or":[
//             {name:{$regex:req.params.key}},
//             // {category:{$regex:req.params.key}},
//             // {discription:{$regex:req.params.key}}
//         ]
//     });
//  res.json({result})
// })
// cloudinary.config({
//     cloud_name:process.env.CLOUDNIRAY_NAME,
//     api_key:process.env.CLOUDNIRAY_API_KEY,
//     api_secret:process.env.CLOUDNIRAY_API_SECRET,
// })
if (process.env.NODE_ENV=='production'){
    app.use(express.static('frontend/build'))
}
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`SERVER is working on port:${PORT}`);
})
