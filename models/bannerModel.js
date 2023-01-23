const mongoose=require('mongoose')
const Banner=mongoose.Schema({
file:{
        type:String,
        required:true},

name:
        {type:String,
        required:true},
// discription:
//         {type:String,
//         required:true},
// price:
//         {type:String,
//         required:true},
// category:
//         {type:String,
//         required:true}
});
module.exports=mongoose.model("Banner",Banner)