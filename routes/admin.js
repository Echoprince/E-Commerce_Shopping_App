const express = require('express')
const router = express.Router()
const {createAProduct, getAllProducts} = require('../controllers/admin')

router.route('/product').post(createAProduct)

router.route('/products').get(getAllProducts)

module.exports = router