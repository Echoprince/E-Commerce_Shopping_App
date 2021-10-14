const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    products : [{
        product : {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user : {
        name: {
            type: String,
            required: true
        },

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    }
})

const OrderModel = mongoose.model('Order', schema)
module.exports = OrderModel