var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let User = require('../models/user.model');
const user = require('../models/user.model');

const { body, validationResult } = require('express-validator');
/* get all users - To be removed */
router.get('/', function (req, res) {
  user
    .find()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//Authentication and Authorization referenced from https://www.topcoder.com/thrive/articles/authentication-and-authorization-in-express-js-api-using-jwt

router.post(
  '/register',
  /* Parameter Validation */
  body('email').notEmpty(),
  body('password').exists().bail().notEmpty().bail().isLength({ min: 6 }),
  body('firstName').exists().bail().notEmpty(),
  body('lastName').exists().bail().notEmpty(),
  body('role')
    .exists()
    .bail()
    .notEmpty()
    .bail()
    .isIn(['Student', 'TA', 'Tutor']),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    /* begin - registration logic  */
    var saltRounds = 8;

    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      alias: req.body.alias ?? null,
      role: req.body.role,
      verified: false,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });

    user
      .save()
      .then(() => res.status(200).json('User registered successfully!'))
      .catch(err => res.status(400).json('Error: ' + err));
  }
);

/* Authenticate user */
router.post(
  '/login',
  /* Parameter Validation */
  body('email').exists().bail().notEmpty().bail().isEmail(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    //1.Check user exists
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: error });
      } else if (!user) {
        res.status(404).send({ message: 'User was not found!' });
        return;
      }

      /* 2. Vaidating password */
      var passwordIsCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsCorrect) {
        res.status(401).json({ token: null, message: 'Password is invalid.' });
        return;
      }

      /* 3. Create a token by signing the user id with the private key. */
      var token = jwt.sign(
        { id: user._id, date: Date.now },
        process.env.JWT_SECRET,
        { expiresIn: 86400 } // token expires every 24 hours - Will be decreased to 60 min
      );

      /* 4. Send the token back to client + some user info */
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
  }
);

module.exports = router;
