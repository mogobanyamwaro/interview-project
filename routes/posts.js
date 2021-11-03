const express = require('express');
const router = express.Router();

const {
  createPost,
  updatePost,
  deletePost,
  likeDislike,
  getAllPost,
  getPost,
  commnentPost,
} = require('../controller/postController');

const { isAuthenticatedUser } = require('../middleware/auth');

// create post
router.route('/').post(createPost);
// update post
router.route('/:id').put(updatePost);
// delete post
router.route('/:id').delete(deletePost);
// like /dislike a post
router.route('/:id/like').put(likeDislike);
// get a post
router.route('/:id').get(isAuthenticatedUser, getPost);
// get all post
router.route('/').get(getAllPost);
// comment on a post
router.route('/:id/comment').put(commnentPost);

module.exports = router;
