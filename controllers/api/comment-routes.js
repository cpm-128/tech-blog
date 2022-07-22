const router = require('express').Router();
const { Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

// GET all comments
// CREATE new comment

//TODO: all withAuth to all except get route

// GET all comments
router.get('/', (req, res) => {
  Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// CREATE new comment
router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create({
//      ...req.body,
//todo: what needs to be here??
      user_id: req.session.userId,
      post_id: req.session.postId,
      comment_text: body.body
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
