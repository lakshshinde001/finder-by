const Product = require('../models/productModel.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js');
const ApiFeatures = require('../utils/apiFeatures.js');
const productModel = require('../models/productModel.js');

// Create products -- admin
exports.createProduct = catchAsyncErrors( async (req, res, next) =>{

    req.body.user = req.user.id;
   
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
    console.log(products);
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
            
        })

   
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

  // Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
