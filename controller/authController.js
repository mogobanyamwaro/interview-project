const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Register a user => /api/auth/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const newUser = new User({
    username,
    email,
    password,
  });
  const user = await newUser.save();

  sendToken(user, 200, res);
});

// Login a user => /api/auth/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  // Checks if email and password is entered by the user and returns

  if (!email || !password) {
    return next(new ErrorHandler('Please enter the email & password', 400));
  }
  // Finding user in database
  const user = await User.findOne({ email: email }).select('+password');
  // Check if the user in not in the database
  console.log(user);
  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 401));
  }

  sendToken(user, 200, res);
});

// Logout user => /api/auth/logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});
