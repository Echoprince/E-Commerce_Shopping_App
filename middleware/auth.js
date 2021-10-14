const jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")
const {TOKEN_SECRET} = require('../config.js')
const UserModel = require('../model/userModel')

module.exports = async (req, res, next) => {
    
const authHeader = req.get('Authorization')
// console.log(authHeader)
if(!authHeader){
    return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Unauthorized'
    })
}
const token = authHeader.split(' ')[1]
// console.log(token)
let decodedToken
try {
    decodedToken = jwt.verify(token, TOKEN_SECRET )
    const user = await UserModel.findOne({_id: decodedToken.userId, 'tokens.token': token})

    if(!user){
        throw new Error()
    }
    if(!decodedToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized'
        })
    }
    
    req.user = user
    req.userId = decodedToken.userId
    req.token = token
    // console.log('FROM MIDDLEWARE => USER OBJECT', req.user, 'THE TOKEN',req.token, 'THE USER ID',req.userId)

    next()
} catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({error: true, message: 'Not Authenticated!'})
}

}