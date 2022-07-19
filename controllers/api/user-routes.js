const router = require('express').Router();
const { User } = require('../../models');

// GET all users
// POST single user
// LOGIN
// LOGOUT

// GET /api/users for testing purposes
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// CREATE api/users
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login Route for Authentication - compares user-entered password to hashed password
router.post('/login', async (req, res) => {
  try {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      // does the user exist?
      res.status(400).json({ message: 'No user account found.' });
      return;
    }

    // verify user using the password they entered in the body
    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found.' });
      return;
    }

    // save session information
    req.session.save(() => {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json({ user, message: 'You are now logged in.' });
    });
  } catch (err) {
    res.status(400).json({ message: 'No user account found.' });
  }
});

// LOGOUT by destroying session variables and resetting cookie
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
