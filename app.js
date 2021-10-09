const express = require('express')

const {PORT} = require('./config')
const logger = require('./log/logger')
const connectDB = require('./database/db.connection.js')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const {get404Error} = require('./controllers/error')

const app = express()

app.use(express.json())

app.use('/api/admin', adminRoutes)
app.use('/api/shop', shopRoutes)

//Error Page
app.use(get404Error)

connectDB()

app.listen(PORT, (req, res, next) => {
    console.log(`App is listening on port ${PORT}`)
})