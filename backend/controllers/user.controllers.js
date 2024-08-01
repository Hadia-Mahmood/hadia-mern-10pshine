const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const  logger  = require('../pino_logger');
const {globalErrorHandler} = require('../middleware/globalErrorHandler');


const userLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return  next(globalErrorHandler(400, "Email and Password are required"))
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        logger.info("email is not a match");
       return next(globalErrorHandler(404, "User not found"))
      }
  
   
      if (user?.password != password) {
        logger.info("password is not a match");
        return  next(globalErrorHandler(401, "Wrong Credentials"))
      }
  
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn:  process.env.TOKEN_EXPIRY,
      });
      logger.info(`log in successfull: ${user.fullName}`);
      res.status(200).json({
        error: false,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        accessToken: token,
        message: "Login Successful",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
    }
  });

//create account
const createUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return next(globalErrorHandler(400, "Full Name is required"))
  }
  if (!email) {
    return next(globalErrorHandler(400, "Email is required"))
  }
  if (!password) {
    return next(globalErrorHandler(400, "Password is required"))
  }
  
  try {
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return next(globalErrorHandler(400, "User already Exists"))
  }

  const user = new User({
    fullName,
    email,
    password,
  });
  await user.save();
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn:  process.env.TOKEN_EXPIRY, }
  );
  return res.json({
    error: false,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
    accessToken, 
    message: "Registration Successful",
  });} catch (error) {
    logger.error(error,"Internal Server Error");
    next(error)
    
  }
});
  
  
module.exports = {createUser, userLogin };