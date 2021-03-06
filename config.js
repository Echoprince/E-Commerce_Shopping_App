const dotenv = require('dotenv')
dotenv.config({path: '../e-commerce_App/config/.env'})

module.exports = {
    PORT : process.env.PORT,
    TOKEN_SECRET : process.env.TOKEN_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
    API_KEY_MAILER: process.env.API_KEY_MAILER,
    STRIPE_KEY: process.env.STRIPE_KEY
}

