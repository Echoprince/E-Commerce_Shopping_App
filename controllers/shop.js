const ProductModel = require('../model/productModel')

const getAllProducts = async (req, res, next) => {
    const products = await ProductModel.find()
    if(products.length === 0){
        return res.json({message: 'You have no product available', result: 'Shop-Products', products})
    }
    res.status(200).json({error: false, message:'Successfully fetched all products', result: products})
}

const getCart = async (req, res, next) => {
    
}

const getOrder = async (req, res, next) => {
    
}

const getCheckout = async (req, res, next) => {
    
}


module.exports = {
    getCart,
    getAllProducts,
    getCheckout,
    getOrder
    
}