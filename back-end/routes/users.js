var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let User = require('../models/user.model');
const user = require('../models/user.model');

/* get all users */
router.get('/', function (req, res) {
  user
    .find()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//Authentication and Authorization referenced from https://www.topcoder.com/thrive/articles/authentication-and-authorization-in-express-js-api-using-jwt

/* Register new user */
router.post('/register', function (req, res) {
  var saltRounds = 10;

  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    alias: req.body.alias,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  });

  user
    .save()
    .then(() => res.status(200).json('User registered successfully!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* Authenticate user */
router.post('/login', function (req, res) {
  //Check user exists
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: error });
    }
    //user not found
    else if (!user) {
      res.status(404).send({ message: 'User was not found!' });
      return;
    }

    /* Vaidating password */
    var passwordIsCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsCorrect) {
      res.status(401).json({ token: null, message: 'Password is invalid.' });
      return;
    }

    //Sign token with user id (supplied by mongoDB) before sending it
    var token = jwt.sign(
      { id: user._id }, // user supplied id
      process.env.JWT_SECRET, //key used to create signature
      { expiresIn: 86400 } // token expires every 24 hours
    );

    //Send the token back to client
    res.status(200).json({
      user: {
        //user info
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'login was successfull',
      token: token,
    });
  });
});

module.exports = router;
