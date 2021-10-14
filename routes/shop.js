const express = require('express')
const router = express.Router()
const isAuth = require('../middleware/auth')

const {getAllProducts, getCart, getIndexPage, postOrder, getASingleProduct, addProductToCart, deleteCartItemById, getUserOrder} = require('../controllers/shop')

/**
 * All ROUTES BELOW SHARE END POINT '/api/shop'
 */

 router.route('/products').get(getIndexPage)

router.route('/products/me').get(isAuth, getAllProducts)

router.route('/cart').get(isAuth, getCart).post(isAuth, addProductToCart)

router.route('/cart-delete').post(isAuth, deleteCartItemById)

router.route('/order').post(isAuth, postOrder).get(isAuth, getUserOrder)

router.route('/:productId').get(isAuth, getASingleProduct)

module.exports = router
