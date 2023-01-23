const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    // _id:String,
    name: { 
        type: String, 
        // required: true, 
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    stock:{
        type:Number,
        // required:true,
    },
    price: { 
        type: Number, 
        // required: true 
    },
    quantity: {
        type: Number,
        // required: true
    },
    description: {
        type: String,
        // required: true,
        trim: true
    },
    offer: { type: Number },
    productPictures: [
        { img: { type: String },
        // shortid: {
        //     type: String,
        //     default: shortid.generate
        //   },
          
 }
    //    Object
    ],
    reviews: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            review: String
        }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
    updatedAt: Date,

}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);