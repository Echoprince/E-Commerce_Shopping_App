const express = require('express')

const {PORT} = require('./config')
const logger = require('./log/logger')
const connectDB = require('./database/db.connection.js')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const {get404Error} = require('./controllers/error')
const isAuth = require('./middleware/auth')

const app = express()

app.use(express.json())

// app.use(isAuth)

// app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/auth', authRoutes)

//Error Page
app.use(get404Error)

connectDB()

app.listen(PORT, (req, res, next) => {
    console.log(`E-Commerce Application is listening on port ${PORT}`)
})

/**
 * FEATURES TO IMPROVE ON 
 * 1. User should be able to delete cart items one by one OR at once
 * 2. Upon making order, User should be able to know total price or Order made
 */