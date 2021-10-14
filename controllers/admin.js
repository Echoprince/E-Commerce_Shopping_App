const ProductModel = require('../model/productModel')
const { StatusCodes } = require("http-status-codes")

const getAllProducts = async (req, res, next) => {
    const products = await ProductModel.find()
    if(products.length === 0){
        return res.json({message: 'No Post Found on the datase for now', result: products})
    }
    res.status(200).json({error: false, message:'Successfully fetched all products from database', result: products})
}


const createAProduct = async (req, res, next) => {
    const { title, description, price } = req.body
    const existingProduct = await ProductModel.findOne({title})
    if(existingProduct){
        return res.status(StatusCodes.BAD_REQUEST).json({error: true, message: 'Product Already exist'})
    }
    const product = new ProductModel({title, description, price, userId: req.userId})
    await product.save()
    res.status(StatusCodes.CREATED).json({error: false, message: `Product created by ${req.user.name}`, result: product})

}

const editProductById = async (req, res, next) => {
    const {title, description, price} = req.body
    const {productId} = req.params
    const existingProduct = await ProductModel.findById(productId)
    if(!existingProduct) { 
        return res.status(StatusCodes.BAD_REQUEST).json({message: `No product found with id ${productId}`})
    }
    if(existingProduct.userId.toString() !== req.userId.toString()){
        return res.status(StatusCodes.UNAUTHORIZED).json({error: true, message: 'Unauthorized Action'})
    }
    existingProduct.title = title
    existingProduct.description = description
    existingProduct.price = price
    
    await existingProduct.save()
    res.status(StatusCodes.OK).json({error: false, message: `Product updated successfully by ${req.user.name}`, result: existingProduct})

}

const deleteProductById = async (req, res, next) => {
    const {productId} = req.params
    const existingProduct = await ProductModel.findById(productId)
    if(!existingProduct) { 
        return res.status(StatusCodes.BAD_REQUEST).json({message: `No product found with id ${productId}`})
    }
    if(existingProduct.userId.toString() !== req.userId.toString()){
        return res.status(StatusCodes.UNAUTHORIZED).json({error: true, message: 'Unauthorized Action'})
    }
    await ProductModel.findByIdAndDelete(productId)
    res.status(StatusCodes.OK).json({error: false, message: `Product  with id ${productId} Deleted Successfully by ${req.user.name}`, result: {}})

}


module.exports = {
    createAProduct,
    getAllProducts,
    editProductById,
    deleteProductById
}