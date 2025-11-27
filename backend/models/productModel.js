const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number,
    rating : {
        type: Number,
        default: 4.5
    },
    ratingCount : {
        type: Number,
        default: 0
    },
    colors : {
        type: [String],
        default: []
    },
    stock : {
        type: Number,
        default: 0
    }
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel