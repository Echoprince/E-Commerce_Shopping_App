const express = require('express')
const router = express.Router()
const {createAProduct, getAllProducts, editProductById, deleteProductById} = require('../controllers/admin')
const isAuth = require('../middleware/auth')

router.route('/product').post(isAuth, createAProduct)

router.route('/products').get(getAllProducts)

router.route('/:productId').put(isAuth, editProductById).delete(isAuth, deleteProductById)

module.exports = router