

const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');

const User = require('../models/userModel.js');
const sendToken = require('../utils/jwtToken.js');

// Register user 

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name, 
        email,
         password,
        avatar : {
            public_id : "this is sample id",
            url : "this is sample url"
        }
    });


    const token = user.getJWTToken();
    res.status(201).json({
        status : "success",
        message : "User created successfully",
        user
    });
}) 

// Login user 

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400))
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next (new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched =  user.comparePassword();

    if(!isPasswordMatched){
        return next (new ErrorHandler("Invalid email or password", 401));
    }

    const token = user.getJWTToken();
    
    res.status(201).json({
        sucess: true,
        message: "User logged in successfully",
        token
    })
})

// Logout user 

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token",null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
})