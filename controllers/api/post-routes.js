const router = require('express').Router();
const { Post, User, Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

// GET all posts
// CREATE post
// UPDATE single post by id
// DELETE single post by id

//TODO: add withAuth to all except for GET

// GET all posts for testing purposes
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'content',
      'title',
      'created_at'
    ],
    // sort by
    order: [['created_at', 'DESC']],
    // join
    include: [
      { //author
        model: User,
        attributes: ['username']
      },
      { //comments
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at'
        ],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
  .then(dbAllPostData => res.json(dbAllPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//TODO: see ryan's message 2:09 pm
// CREATE post
router.post('/', async (req, res) => {
  const body = req.body;

  try {
    //const newPost = await Post.create({ ...body, user_id: req.session.userId });
    const newPost = await Post.create({
      title: body.title,
      content: body.body,
      user_id: req.session.userId
    });
    res.json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE single post by id
router.put('/:id', async (req, res) => {
  try {
    let postData = await Post.update(
      {
        title: req.body.title,
        content: req.body.body,
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    console.log('>>> post data >>>' , postData);
    if(!postData) {
      res.status(404).json('No post found with this id.');
      return;
    }
    // if (affectedRows > 0) {
    //   res.status(200).end();
    // } else {
    //   res.status(404).end();
    // }
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE single post by id
router.delete('/:id', async (req, res) => {
  try {
    const [affectedRows] = Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
