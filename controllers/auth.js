const {randomBytes} = require('crypto')

const {createTransport} = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const UserModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const {  TOKEN_SECRET, TOKEN_EXPIRES_IN, API_KEY_MAILER } = require("../config");


const transporter = createTransport(sendgridTransport({
    auth : {
        api_key: API_KEY_MAILER
    }
}))


//REGISTER USER => PUT
const register = async (req, res, next) => {
    try {
        const {name, email, password} = req.body
        
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              message: "User already exists! Do you want to update user info?",
              result: {email: email, password: password},
            });
          }
          console.log(req.body)
          const hashedPw = await bcrypt.hash(password, 12)
    
          const user = new UserModel({ name, email, password: hashedPw, cart : {items : []} });
          await user.save();

          res.status(StatusCodes.CREATED).json({
            message: "User Registered successfully!, Please Login!",
            result: user,
          })
         return transporter.sendMail({
              to: email,
              from: 'uchennachieke@gmail.com',
              subject: 'Welcome to e-commerce 4Business by Uche',
              html: '<h1>Congratulations!! You Successfully Registered, Now Start your Shopping!</h1>'

          })
        
    } catch (error) {
        error.statusCode = 500
        throw error
    }
};


//LOGIN USER => POST
const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid Credentials, Please Register",
      result: {email: req.body.email, password: req.body.password},
    });
  }

  let loadedUser = user

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid Credentials",
      result: {email: req.body.email, password: req.body.password},
    });
  }
  const token = jwt.sign({ userId: loadedUser._id.toString(), 
    email: loadedUser.email }, 
  TOKEN_SECRET,
  { expiresIn: TOKEN_EXPIRES_IN 
});

user.tokens = user.tokens.concat({token})
await user.save()

  res.status(StatusCodes.OK).json({
    message: "User logged in successfully!",
    result: {name: user.name, email: user.email},
    token,
  });
};


const getUserProfile = (req, res, next) => {
 res.status(StatusCodes.OK).json({error: false, message: `Hello ${req.user.name} Your Profile`, result: req.user})
}

const resetPassword = async (req, res, next) => {

  try{
    randomBytes(32, async (err, buffer) =>  {
      if(err){
          return res.json({message: 'An Error Ocurred'})
      }
      const token = buffer.toString('hex')
      const user = await UserModel.findOne({email: req.body.email})
      if (!user) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid Credentials",
            result: {email: req.body.email},
          });
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        await user.save()
        res.json({error: false, message: `Please use the token to reset your password ${token}`})
        
        transporter.sendMail({
          to: req.body.email,
          from: req.user.email,
          subject: 'Password Reset',
          html: `<p>You Requested A Reset of Password</p>
               <p>Please Click this <a href="http://localhost:3000/api/auth/reset/${token}">link</a> to set a new password</p>
           `
      })
      
      })

  }catch(e){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({error: true, 
      message: 'An Error Occured', 
      errorMessage: e.message 
    })
  }

}

const getNewPassword = async (req, res, next) => {
    const {token} = req.params
    const user = await UserModel.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    res.status(200).json({error: false, message: 'Successful', userId: user._id.toString(), passwordToken: token})
}

const postNewPassword = async (req, res, next) => {
    const {passwordToken, userId, newPassword} = req.body
    const user = await UserModel.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
    const hashedNewPw = await bcrypt.hash(newPassword, 12)
    user.password = hashedNewPw
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
    res.status(200).json({error: false, message: 'Password Changed Successfully'})
    transporter.sendMail({
        to: req.user.email,
        from: req.user.email,
        subject: 'Password Reset Successful',
        html: `<h1>Hi ${user.name} Your password has been changed successfully</h1>`
         
    })
}


const logout = async (req, res, next) => {
  try{
    
    req.user.tokens = req.user.tokens.filter(t => {
      return t.token !== req.token
    })

    await req.user.save()
    res.status(StatusCodes.OK).json({
      error: false,
      message: 'User logged Out!'
      
    })

  }catch(e){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true, message: 'Error Occured', errorMessage: e.message
    })
  }
}




//HELPER FUNCTION => CHECKING EMAIL
const getUserByEmail = async email => {
    return await UserModel.findOne({ email }).select("-password");
};


 module.exports = { register, login, resetPassword, getNewPassword, postNewPassword, getUserProfile, logout };


























//   const createUser = async (req, res) => {
//     try {
//       const { name, email, password, cart } = req.body;
  
//       const existingUser = await getUserByEmail(email);
//       if (existingUser) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//           message: "User already exists! Do you want to update user info?",
//           result: {},
//         });
//       }
  
//       const user = new UserModel({ name, email, password, cart });
//       await user.save();
  
//       res.status(StatusCodes.CREATED).json({
//         message: "User created successfully!",
//         result: user,
//       });
//     } catch (err) {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "Internal Server Error Occurred",
//       });
//     }
//   };
  

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       message: "Invalid Credentials",
//       result: {},
//     });
//   }

//   const isPasswordValid = await user.comparePassword(password);

//   if (!isPasswordValid) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       message: "Invalid Credentials",
//       result: {},
//     });
//   }

//   const token = jwt.sign({ _id: user._id, email: user.email }, config.TOKEN, { expiresIn: config.TOKEN_EXPIRY });

//   return res.status(StatusCodes.OK).json({
//     message: "User logged in successfully!",
//     result: user,
//     token,
//   });
// };

// const getLoggedInUser = (req, res) => {
//   try {
//     const { user } = req;

//     return res.status(StatusCodes.OK).json({
//       message: "Logged in user",
//       result: user,
//     });
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: "Internal Server Error Occurred",
//     });
//   }
// };

