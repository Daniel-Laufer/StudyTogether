var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var helperUser = require('../helpers/helperUser');
var User = require('../models/user.model');

const { body, validationResult } = require('express-validator');
/* get all users - To be removed */
router.get('/', function (req, res) {
  User.find()
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

    /* begin - register logic  */
    var saltRounds = 8;

    var newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      alias: req.body.alias ?? null,
      role: req.body.role,
      verified: false,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });

    newUser
      .save()
      .then(user =>
        helperUser.respondJWT(user, res, 'User registered successfully!')
      )
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

    //1.Check if user exists
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

      /* 3. Send JWT back to client*/
      helperUser.respondJWT(user, res, 'login was successfull');
    });
  }
);

module.exports = router;
