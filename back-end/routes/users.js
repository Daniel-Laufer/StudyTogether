var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var helperUser = require('../helpers/helperUser');
let StudygroupModel = require('../models/studygroup.model');
var User = require('../models/user.model');
var tarequest = require('../models/taverify.model');
const { check, body, validationResult } = require('express-validator');

/* Get non-sensitive user profile info */
router.get('/profile/:id', helperUser.verifyToken, async (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Invalid JWT token' });
    return;
  }
  var usr;

  //if user is checking their own profile -> provide all info (TODO: remove password hash)
  if (req.user.id === req.params.id) {
    usr = await User.findById(req.user.id).catch(err => {
      res.status(400).json('Error: ' + err);
      return;
    });
    res.status(200).json(usr);
  }
  //if user is checking other profile -> provide public info
  else {
    usr = await User.findById(req.params.id).catch(err => {
      res.status(400).json('Error: ' + err);
      return;
    });

    res.status(200).json({
      firstName: usr.firstName,
      lastName: usr.lastName,
      userName: usr.userName,
      role: usr.role,
      profileImage: usr.profileImage,
      profileAboutMe: usr.profileAboutMe,
      profileContactInfo: usr.profileContactInfo,
      profileInterests: usr.profileInterests,
      profileCourses: usr.profileCourses,
    });
  }
});

/* Update non-sensitive user profile info */
router.patch(
  '/profile',
  [
    //middlewares
    helperUser.verifyToken,
    body(['password', 'email', 'verified', 'created']).not().exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    if (!req.user) {
      res.status(403).send({ message: 'Invalid JWT token' });
      return;
    }
    var usr = await User.findById(req.user.id).catch(err => {
      res.status(400).json('Error: ' + err);
      return;
    });

    /* BEGIN - Update user profile */
    var updatedUser = await User.findByIdAndUpdate(usr.id, req.body).catch(
      err => {
        res.status(400).json('Error: ' + err);
        return;
      }
    );
    res.status(200).json({
      message: 'User profile updates successfully!',
      updatedUser: updatedUser,
    });
  }
);

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
      verified: false,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });

    if (req.body.role == 'TA') {
      var newrequest = new tarequest({
        userid: newUser._id,
        firstname: newUser.firstName,
        lastname: newUser.lastName,
      });
      newUser.role = 'Student';
      newrequest.save().catch(err => res.status(500).json('Error: ' + err));
    } else {
      newUser.role = req.body.role;
    }

    newUser
      .save()
      .then(user =>
        helperUser.respondJWT(user, res, 'User registered successfully!')
      )
      .catch(err => res.status(400).json('Error: ' + err));
  }
);

router.post(
  '/bookmark-group',
  helperUser.verifyToken,
  /* Parameter Validation */
  body('studygroupId').exists().bail().notEmpty(),
  (req, res) => {
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    const groupId = req.body.studygroupId;
    if (!groupId) {
      res.status(400).send({ message: 'Missing studygroupId field' });
      return;
    }

    // check that the studygroup exists
    StudygroupModel.findById(groupId)
      .then(() => {
        // check whether user already has this study group bookmarked
        const user = req.user;
        if (!Array.isArray(user.savedStudygroups)) {
          user.savedStudygroups = [groupId];
        }

        if (user.savedStudygroups.includes(groupId)) {
          res.status(400).send({ message: 'Study group already bookmarked' });
          return;
        }

        user.savedStudygroups.push(groupId);
        user.save();
        res
          .status(200)
          .send({ message: 'Study group bookmarked successfully!' });
      })
      .catch(err => res.status(404).send({ Error: 'Invalid study group id' }));
  }
);

router.patch(
  '/unbookmark-group',
  helperUser.verifyToken,
  body('studygroupId').exists().bail().notEmpty(),
  /* Parameter Validation */
  (req, res) => {
    if (!req.user) {
      res.status(401).send({ message: 'Invalid JWT token' });
      return;
    }

    const groupId = req.body.studygroupId;

    // check that the studygroup exists
    StudygroupModel.findById(groupId)
      .then(() => {
        // check whether user really has bookmarked this study group
        const user = req.user;
        var groupIndex = user.savedStudygroups.indexOf(groupId);
        if (groupIndex == -1) {
          res.status(400).send({ message: 'Study group is not bookmarked' });
          return;
        }

        user.savedStudygroups.splice(groupIndex, 1);
        user.save();
        res
          .status(200)
          .send({ message: 'Study group unbookmarked successfully!' });
      })
      .catch(() => res.status(404).send({ Error: 'Invalid study group id' }));
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
