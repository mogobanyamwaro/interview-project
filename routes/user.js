const express = require('express');
const router = express.Router();

const {
  getUsers,
  followUser,
  unfollower,
  getAllUsers,
} = require('../controller/userController');

const { isAuthenticatedUser } = require('../middleware/auth');

// follow user
router.route('/:id/follow').post(followUser);
// unfollow a user
router.route('/:id/unfollow').post(unfollower);
// get a user
router.route('/:id').get(isAuthenticatedUser, getUsers);
// get all users
router.route('/').get(getAllUsers);

module.exports = router;
