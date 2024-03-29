const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

//TODO: all withAuth to ALL routes here

router.get('/', async (req, res) => {
  console.log(req.session.userId, " this is the session userId");
  try {
    // store the results of the db query in a variable called postData. should use something that "finds all" from the Post model. may need a where clause!
    const postData = await Post.findAll({
      where: {
        // use the ID from the session
        //userID is from the start code
        //user_id is from my model
        user_id: req.session.userId
      }
    })
    // this sanitizes the data we just got from the db above (you have to create the above)
    const posts = postData.map((post) => post.get({ plain: true }));

    // fill in the view to be rendered //TODO: this should display all posts for the user?
    res.render('all-posts-admin', {
      // this is how we specify a different layout other than main! no change needed
      layout: 'dashboard',
      // coming from line 10 above, no change needed
      posts,
    });
  } catch (err) {
    console.log('>> unable to access dashboard <<')
    res.redirect('login');
  }
});

router.get('/new', (req, res) => {
  // what view should we send the client when they want to create a new-post? (change this next line)
  res.render('new-post', {
    // again, rendering with a different layout than main! no change needed
    layout: 'dashboard',
  });
});

router.get('/edit/:id', async (req, res) => {
  try {
    // what should we pass here? we need to get some data passed via the request body
    const postData = await Post.findByPk(req.params.id);

    if (postData) {
      // serializing the data
      const post = postData.get({ plain: true });
      // which view should we render if we want to edit a post?
      res.render('edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
