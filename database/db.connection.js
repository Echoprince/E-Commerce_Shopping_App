const mongoose = require('mongoose')
const logger = require('../log/logger')
const {MONGO_URI} = require('../config.js')

const connectDB = async () => {
    try {

        const con = await mongoose.connect(`${MONGO_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${con.connection.host}`)
        
    } catch (error) {
        console.log(error)
        process.exit(1) 
    }
}

module.exports = connectDB