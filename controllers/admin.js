const ProductModel = require('../model/productModel')

const getAllProducts = async (req, res, next) => {
    const products = await ProductModel.find()
    if(products.length === 0){
        return res.json({message: 'You have no product available', result: 'admin-products',products})
    }
    res.status(200).json({error: false, message:'Successfully fetched all products', result: products})
}


const createAProduct = async (req, res, next) => {
    const { title, description, price } = req.body
    const existingProduct = await ProductModel.findOne({title})
    if(existingProduct){
        return res.status(400).json({error: true, message: 'Product Already exist'})
    }
    const product = new ProductModel({title, description, price})
    await product.save()
    res.status(201).json({error: false, message: 'Product created', result: product})

}


module.exports = {
    createAProduct,
    getAllProducts
    
}