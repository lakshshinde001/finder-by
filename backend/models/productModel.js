
const mongoose = require('mongoose');
const { type } = require('os');

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "Please enter product name "]
    },
    description : {
        type : String,
        required : [true, "Please enter product description  "]
    },
    price : {
        type : Number,
        required : [true, "Please enter product price here"],
        maxLength :[8 , "Price can't exceed more than 8 characters"]
    },
    ratings : {
        type : Number, 
        default : 0
    },
    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    category : {
        type : String,
        required : [true, "please enter product Category "]
    },
    stock : {
        type : Number,
        required : [true, "Please enter product Stock "],
        maxLength : [4, "Stock can't exceed than 4 characters " ]
    },
    numOfReviews : {
        type: Number,
        default : 0
    },
    reviews : [
        {
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            },
            user:{
                type: mongoose.Schema.ObjectId,
                ref : "User",
                required : true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);