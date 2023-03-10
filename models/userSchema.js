const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema =mongoose.Schema({
  name: {
    type: String,
  },
  username:{
    type:String,
    // required:true,trim:true,unique:true,index:true,
    // lowercase:true
  },
  email: {
    type: String,
    // unique: true,
    // validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    // select: false,
  },
  userProfile: [
    { img: { type: String },
    // shortid: {
    //     type: String,
    //     default: shortid.generate
    //   },
      
}//    Object
],
phonenumber:{
  type:Number,
},
tokens:[{
  token:{
    type:String,
    // required:true, 
  }
}],
  // avatar: {
  //   public_id: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //     required: true,
  //   },
  // },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = async function () {
 try {
let sellopoint=jwt.sign({ id: this._id }, process.env.JWT_SECRET);
this.tokens=this.tokens.concat({token:sellopoint});
this.save();
return sellopoint;
 } catch (error) {
  console.log(error);
 }
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
