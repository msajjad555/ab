const mongoose=require ('mongoose');
const categorySchema=mongoose.Schema({
    // product: {type:mongoose.SchemaTypes.ObjectId,ref:'Products'},
    name:{
        type:String,
        trim:true
    },
    slug:{
        Type:String,
        // required:[true,'required'],
        // unique:[true,'required']

    },
    categoryImage:{
        type:String
    },
    parentId:{
        type:String
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', },
},{timestamps:true});

module.exports=mongoose.model('Category',categorySchema)