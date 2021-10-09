const express = require('express')
const router = express.Router()

const {getAllProducts, getCart, getCheckout, getOrder} = require('../controllers/shop')

router.route('/products').get(getAllProducts)

router.route('/cart').get(getCart)

router.route('/order').get(getOrder)

router.route('/checkout').get(getCheckout)

module.exports = router
