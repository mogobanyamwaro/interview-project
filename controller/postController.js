const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const Post = require('../models/Post');

// create a post
exports.createPost = catchAsyncErrors(async (req, res, next) => {
  const newPost = new Post(req.body);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost);
});

// update  a post

exports.updatePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });
    res.status(200).json('the post has been updated');
  } else {
    res.status(403).json('you can update only your post');
  }
});

// delete a post
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json('the post has been deleted');
  } else {
    res.status(403).json('you can delete only your post');
  }
});

// like /dislike a post

exports.likeDislike = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.status(200).json('The post has been liked');
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.status(200).json('The post has been disliked');
  }
});

// get a post

exports.getPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json(post);
});

// get user's all post

exports.getAllPost = catchAsyncErrors(async (req, res, next) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
});
// comment on a post

exports.commnentPost = catchAsyncErrors(async (req, res, next) => {
  const user = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
