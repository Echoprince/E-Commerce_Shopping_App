const express = require('express')


const {check} = require('express-validator')
const router = express.Router()

const {register, login, resetPassword, getNewPassword, postNewPassword, getUserProfile, logout} = require('../controllers/auth')
const validator = require("../middleware/validator")
const isAuth = require('../middleware/auth')

router
  .route("/register")
  .post(
    [
      check("name", "Please enter a valid first name").notEmpty(),
      check("email", "Please enter a valid email address").isEmail(),
      check("password", "Please enter a valid password").isLength({ min: 6 }),
    ],
    validator,
    register
  );

  router
  .route("/login")
  .post(
      [
        check("email", "Please enter a valid email address").isEmail(), 
        check("password", "Please enter a valid password").isLength({ min: 6 })
    ], 
    validator, 
    login
    )

  router.route("/profile")
  .get(isAuth, getUserProfile)

  router
  .route("/reset")
  .post(isAuth,
      [
        check("email", "Please enter a valid email address").isEmail(), 
    ], 
    validator, 
    resetPassword
    );

    router.route("/reset/:token").get(isAuth, getNewPassword);
    router.route('/new-password').post(isAuth, postNewPassword)

    router.route('/logout').post(isAuth, logout)



module.exports = router