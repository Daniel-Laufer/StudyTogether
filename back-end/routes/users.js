var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var helperUser = require('../helpers/helperUser');
var User = require('../models/user.model');
const { body, validationResult } = require('express-validator');

/* Get user profile info */
router.get('/profile/:id', helperUser.verifyToken, async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Invalid JWT token' });
    return;
  }
  /* BEGIN - Check if the user is authorized to update this information*/
  var usr = await User.findById(req.user.id).catch(err =>
    res.status(400).json('Error: ' + err)
  );
  if (usr.id !== req.user.id) {
    res.status(401).send({ message: 'Permission Denied!' });
    return;
  }

  res.status(200).json(usr);
});

/* Update user profile info */
router.put('/profile/:id', helperUser.verifyToken, async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Invalid JWT token' });
    return;
  }
  /* BEGIN - Check if the user is authorized to update this information*/
  var usr = await User.findById(req.user.id).catch(err =>
    res.status(400).json('Error: ' + err)
  );
  if (usr.id !== req.user.id) {
    res.status(401).send({ message: 'Permission Denied!' });
    return;
  }

  /* BEGIN - Update user profile */
  var updatedUser = await User.findByIdAndUpdate(usr.id, req.body).catch(err =>
    res.status(400).json('Error: ' + err)
  );
  res.status(200).json({
    message: 'User profile updates successfully!',
    updatedUser: updatedUser,
  });
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
      username: req.body.username ?? null,
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
