const ProductModel = require('../model/productModel')
const UserModel = require('../model/userModel.js')
const OrderModel = require('../model/orderModel')
const { StatusCodes } = require("http-status-codes")
const {STRIPE_KEY} = require('../config.js')

const stripe = require("stripe")(`${STRIPE_KEY}`)


const getIndexPage = async (req, res, next) => {
    const products = await ProductModel.find()
    if(products.length === 0){
        return res.json({message: 'No Products Available Yet', result: products})
    }
    res.status(200).json({error: false, message:'Successfully fetched all available products', result: products})
}


const getAllProducts = async (req, res, next) => {
    const products = await ProductModel.findOne({userId: req.userId})
    if(!products){
        return res.json({message: 'You have no product available'})
    }
    res.status(StatusCodes.OK).json({error: false, message:`Successfully fetched all products belonging to ${req.user.name}`, result: products})
}

const getASingleProduct = async (req, res, next) => {
    const {productId} = req.params
    const product = await ProductModel.findById(productId)
    if(!product){
        return res.status(StatusCodes.NOT_FOUND).json({message: `No Product found with the Id ${productId}`})
    }
    if(product.userId.toString() !== req.userId.toString()){
        return res.status(StatusCodes.UNAUTHORIZED).json({error: true, message: 'Unauthorized Action'})
    }
    res.status(200).json({error: false, message: `Successfully fetched product with Id ${productId} for ${req.user.name}`, result: product})
}

const addProductToCart = async (req, res, next) => {
    const {productId} = req.body
    const product = await ProductModel.findById(productId)
    if(!product){
        return res.status(StatusCodes.BAD_REQUEST).json({message: `No product with ID ${productId}`})
    }
    const user = await UserModel.findOne({_id: req.userId})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'No user'})
    }
    const addedProduct = await user.addToCart(product)//product
    const {cart , name, email} = addedProduct
    
    
    res.status(200).json({error: false, message: `Product added to cart successfully by ${req.user.name}`, result: {cart: cart, name: name, email: email}})
    
}

const deleteCartItemById = async (req, res, next) => {
    const {productId} = req.body
    const product = await ProductModel.findById(productId)
    if(!product){
        return res.status(StatusCodes.BAD_REQUEST).json({message: `No product with ID ${productId}`})
    }
    const user = await UserModel.findOne({_id: req.userId})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'No user'})
    }
    const result = await user.removeFromCart(productId)
    const {cart } = result
    res.status(200).json({error: false, message: `Product deleted from Cart successfully by ${req.user.name}`, result: {cart: cart, userId: req.userId}})
    
}

const getCart = async (req, res, next) => {
    const user = await UserModel.findOne({_id: req.userId})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'No user'})
    }
    const {cart, _id} = user._doc
    // const cartProducts = await req.user.populate('cart.items.productId').execPopulate()
res.status(200).json({error: false, message: `Successfully fetched user cart items for ${req.user.name}`, result: {cart : cart, userId: _id}})
    
}



const postOrder = async (req, res, next) => {
    console.log('THIS IS THE POSTORDER', req.userId)
    try{
    
    const user = await UserModel.findOne({_id: req.userId }).populate('cart.items.productId')
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'No user'})
    }


    const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}}
    })
    
    const order = new OrderModel({
        user: {name : req.user.name,
            userId: req.userId
        },
    
        products: products
    })
  await order.save()
  res.status(200).json({error: false, message: `Order created Successfully for ${req.user.name}`, result: order})
  await user.clearCart()

    }catch(e){
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message, message: 'Some error happened'})
        
    }
    
}

const getUserOrder = async (req, res, next) => {
    const user = await UserModel.findOne({_id : req.userId})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'No user found'})
    }
    const order = await OrderModel.find({'user.userId': req.userId})
    res.status(200).json({error: false, message: `Hi ${user.name} here are Your Orders`, result: order})
}

const getCheckoutPage = async (req, res, next) => {
    try{

        let products
        let total = 0
         
        await UserModel.findOne({_id: req.userId}).populate('cart.items.productId')
        .exec((err, prods)=> {
            if(err){
                console.log(err)
            }else{
                products = prods.cart.items
                total = 0
                products.forEach(p => {
                    total += p.quantity * p.productId.price
                    res.status(200).json({error: false, message: `Hi ${req.user.name} here are Your confirmed Orders`, result: {products: products, total_Price : total}})
                })
             
            }
            
        })

     
    }catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message, message: 'Some error occured'})
    }
    
}



module.exports = {
    getCart,
    getAllProducts,
    getASingleProduct,
    deleteCartItemById,
    addProductToCart,
    getUserOrder,
    postOrder,
    getIndexPage,
    getCheckoutPage
    
}