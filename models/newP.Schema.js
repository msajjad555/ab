const mongoose = require("mongoose");


const P = mongoose.Schema({
  name:{type:String},
  images:[  
       { img:{type:String}}
    
    ]
})
module.exports = mongoose.model("P", P);