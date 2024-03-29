const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "please enter your name"],
        maxLength : [30, "name can't be exceed 30 characters"],
        minLenght : [4, " name should have more than  4 characters"]
    },
    email :{
        type : String,
        required : [true, "please enter your email"],
        unique : true,
        validate : [validator.isEmail, "please enter a valid email"]
    },
    password : {
        type : String,
        required : [true, "please enter your password"],
        minLength : [8, "password should have more than  8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String, 
            required : true,
        },
        url : {
            type: String, 
            required : true,
        }
    },
    role :{
        type : String, 
        default : "user",
    },
    resetPasswordToken : String, 
    resetPasswordExpire : Date
});

module.exports = mongoose.Schema('User', userSchema);