const Product = require('../models/productModel.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ApiFeatures = require('../utils/apiFeatures.js');
const productModel = require('../models/productModel.js');

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

    const resultPerPage = 5; 
    const productCount = await Product.countDocuments()
    const apiFeature =  new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products = await apiFeature.query;
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
            product,
            productCount
        })

   
});