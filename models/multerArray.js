const mongoose = require("mongoose");

const MulterArray = new mongoose.Schema({
    images:{type:Array}
})
module.exports = mongoose.model("Multer", MulterArray);