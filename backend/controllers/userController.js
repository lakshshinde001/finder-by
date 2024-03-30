

const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');

const User = require('../models/userModel.js');
const sendToken = require('../utils/jwtToken.js');
const sendMail = require('../utils/sendMail.js')
const crypto = require('crypto')



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

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    
    const resetPasswordToken = crypto
     .createHash('sha256')
     .update(req.params.token)
     .digest('hex');

     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    if(req.body.password !== req.body.comfirmPassword ){
        return next(new ErrorHandler("Password does not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });

  // update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
  // update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    // cloudinary code
  
    // if (req.body.avatar !== "") {
    //   const user = await User.findById(req.user.id);
  
    //   const imageId = user.avatar.public_id;
  
    //   await cloudinary.v2.uploader.destroy(imageId);
  
    //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "avatars",
    //     width: 150,
    //     crop: "scale",
    //   });
  
    //   newUserData.avatar = {
    //     public_id: myCloud.public_id,
    //     url: myCloud.secure_url,
    //   };
    // }
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  

  // Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  
  // Get single user (admin)
  exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });

  // update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Delete User --Admin
  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
    
    // cludinary code 
    // const imageId = user.avatar.public_id;
  
    // await cloudinary.v2.uploader.destroy(imageId);
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });