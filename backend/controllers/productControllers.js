const Product = require('../models/productModel.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');

// Create products -- admin
exports.createProduct = catchAsyncErrors( async (req, res, next) =>{
   
    const product = await Product.create(req.body);
    res.status(200).json({
        success : true,
        product
    })
    
})


// get all products 
exports.getAllProducts = catchAsyncErrors(async (req, res, next) =>{
    const products = await Product.find()
    res.status(200).json({message : "Routes is working fine", products});
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) =>{

        let product = await Product.findById(req.params.id);
        if(!product) {
            return next(new ErrorHandler ("Product not found", 400));
        }
            product = await Product.findByIdAndUpdate(req.params.id, req.body,{
                new : true,
                runValidators : true,
                useFindAndModify : false
        });
        res.status(200).json({
            success : true,
            product
        })
    
});

// Delete a product 

exports.deleteProduct = catchAsyncErrors(async (req, res, next ) => {
   
        const product = await Product.findById(req.params.id);

        if(!product) {
            return next(new ErrorHandler ("Product not found", 400));
        }
        await product.remove;

        res.status(200).json({
            success : true,
            message : "Product deleted successfully"
        })

    
});

// Get Product Detail

exports.getProductDetails = catchAsyncErrors( async (req, res, next) => {
    
        const product = await Product.findById(req.params.id);
        if(!product) {
            return next(new ErrorHandler ("Product not found", 400));
        }
        res.status(200).json({
            success : true,
            product
        })

   
});