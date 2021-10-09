const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    imageUrl : {
        type : String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    price : {
        type : Number,
        default: 0
    },
},{timestamps: true})

const ProductModel = mongoose.model('product', schema)

module.exports = ProductModel