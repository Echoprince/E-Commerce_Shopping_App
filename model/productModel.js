const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price : {
        type : Number,
        default: 0,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{timestamps: true})

const ProductModel = mongoose.model('Product', schema)

module.exports = ProductModel