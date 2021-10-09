const express = require('express')
const {PORT} = require('./config')
const logger = require('./log/logger')
const connectDB = require('./database/db.connection.js')

const app = express()



app.use(express.json())


connectDB

app.listen(PORT, (req, res, next) => {
    logger.info(`App is listening on port ${PORT}`)
})