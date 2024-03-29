const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require('../models/userModel.js');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next (new ErrorHandler("Please log in to See this content", 401));
    }
    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

