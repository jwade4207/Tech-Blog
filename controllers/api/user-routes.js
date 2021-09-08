const router = require('express').Router();
const {User, Post, Comment} = require('../../models');

//get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log('Failed to get all users')
        res.status(500).json(err);
    });
});

//get user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes:{exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            },
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id'})
            return;
        }
        res.json(dbUserData)
    })
    .catch(err => {
        console.log('Failed to get user')
        res.status(500).json(err)
    })
});

//create a new user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log('Failed to add user');
        res.status(500).json(err);
    })
});

//user logs in
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({message: 'No user id with that email address'})
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password)

        if(!validPassword) {
            res.status(400).json({message: 'Incorrect password'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        })
    })
    .catch(err => {
        console.log('Failed to login');
        res.status(500).json(err);
    });
});

//user logsout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
});

//update user
router.put('/:id', (req, res) => {
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log('Failed to update user');
        res.status(500).json(err);
      });
});

//delete user
router.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log('Failed to delete user');
        res.status(500).json(err);
      });
});
  
  module.exports = router;