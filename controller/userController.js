const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
// getSingle user
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const username = req.query.username;
  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username: username });
  if (!user) {
    return next(new ErrorHandler('no user found'));
  }
  const { password, updatedAt, ...other } = user._doc;
  res.status(200).json(other);
});

exports.followUser = catchAsyncErrors(async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({
        $push: { followings: req.params.id },
      });
      res.status(200).json('user has been followed');
    } else {
      res.status(403).json('you allready follow this user');
    }
  }
});
exports.unfollower = catchAsyncErrors(async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json('user has been unfollowed');
    } else {
      res.status(403).json('you dont follow this user');
    }
  }
});
// get a all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(users);
});
