

const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');

const User = require('../models/userModel.js');
const sendToken = require('../utils/jwtToken.js');
const sendMail = require('../utils/sendMail.js')



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
    const isPasswordMatched =  user.comparePassword(password);

    if(!isPasswordMatched){
        return next (new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
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

// forgot passwrod token 

exports.forgotpassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found", 400));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave : false});
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
        )}/api/v1/password/reset/${resetToken}`;
    
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n
    If you did not make this request then simply ignore this email and no changes will be made.`;

    try {
        await sendMail({
            email : user.email,
            subject: "Finderby password recovery",
             message
        });
        res.status(200).json({
            success: true,
            message: `Emal sent to ${user.email} Successfully`
        })
        
    } catch (e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(e.message, 500));
    }

})