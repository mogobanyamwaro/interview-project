const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
} = require('../controller/authController');

const { isAuthenticatedUser } = require('../middleware/auth');

// login logout register
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

module.exports = router;
