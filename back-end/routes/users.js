var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var helperUser = require('../helpers/helperUser');
let StudygroupModel = require('../models/studygroup.model');
let User = require('../models/user.model');
let Token = require('../models/token.model');
const { unfollowUsers, followUsers } = require('../helpers/helperNotification');
var tarequest = require('../models/taverify.model');
const { check, body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const user = require('../models/user.model');
const verifyURL = 'http://localhost:3000/verify';

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

    /* TODO: update the query above to exclude sensitive info instead of doing this mess :< (should be like recommend api)*/
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
      profileFollowers: usr.profileFollowers,
    });
  }
});

/* Get first (x=limit) users you have not followed */
router.get(
  '/profile/recommend/:limit',
  helperUser.verifyToken,
  async (req, res) => {
    /* TODO1: Change logic to something smarter (k means clustering maybe?) */
    /* TODO2: Create an ORM helper to reuse the query below */
    var recommendedUsers = await User.find(
      { _id: { $nin: req.user.profileFollowers } },
      { password: 0, created: 0, email: 0 }
    )
      .limit(10)
      .catch(err => {
        res.status(400).send('Err: ' + err);
        return;
      });
    res.status(200).json({ recommended: recommendedUsers });
  }
);

router.get(
  '/profile/:id/followers',
  helperUser.verifyToken,
  async (req, res) => {
    var usr = req.user;

    if (req.user.id !== req.params.id) {
      usr = await User.findById(req.params.id).catch(err => {
        res.status(400).send('Err: ' + err);
        return;
      });
    }

    var followers = await User.find(
      { _id: { $in: usr.profileFollowers } },
      { password: 0, created: 0, email: 0 } //  Exclude these values from the returned document
    ).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });
    res.status(200).json({ followers: followers });
  }
);

router.get(
  '/profile/:id/following',
  helperUser.verifyToken,
  async (req, res) => {
    var usr = req.user;

    if (req.user.id !== req.params.id) {
      usr = await User.findById(req.params.id).catch(err => {
        res.status(400).send('Err: ' + err);
        return;
      });
    }

    var following = await User.find(
      { _id: { $in: usr.profileFollowing } },
      { password: 0, created: 0, email: 0 } //  Exclude these values from the returned document
    ).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });
    res.status(200).json({ following: following });
  }
);

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

    const url = `${verifyURL}/${newUser.id}`;
    newUser
      .save()
      .then(user =>
        helperUser.respondJWT(user, res, 'User registered successfully!')
      )
      .catch(err => res.status(400).json('Error: ' + err));
  }
);
router.get(
  '/send-verification/:id',
  helperUser.verifyToken,
  async (req, res) => {
    if (!req.user) {
      res.status(403).send('Invalid JWT token');
      return;
    }

    let person = await User.findById(req.params.id);
    if (!person) {
      res.status(404).send('Invalid user');
      return;
    }
    await Token.findOneAndDelete({ email: person.email });
    var saltRounds = 8;
    var salt = await bcrypt.genSalt(saltRounds);
    let verifyToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(verifyToken, salt);
    await new Token({
      email: person.email,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${verifyURL}?id=${person.id}token=${verifyToken}`;
    helperUser.sendEmail(
      person.email,
      'Email verification',
      `Click this link to verify your email: ${link}`
    );
    res.json({ token: verifyToken, id: person.id });
  }
);

router.post(
  '/verify',
  body('id').notEmpty(),
  body('token').notEmpty(),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    let person = await User.findById(req.body.id).catch(err => {
      res.status(400).json('Error: ' + err);
      return;
    });
    let verifyToken = await Token.findOne({ email: person.email });
    if (!verifyToken || verifyToken.length == 0) {
      res.status(401).send('Invalid token');
      return;
    }

    const isValid = bcrypt.compareSync(req.body.token, verifyToken.token);
    if (!isValid) {
      res.status(403).send('Invalid token');
      return;
    }

    if (
      person.email.endsWith('@mail.utoronto.ca') ||
      person.email.endsWith('@utoronto.ca')
    ) {
      person.verified = 'University of Toronto';
    } else {
      person.verified = 'Not University Email';
    }
    person.save().catch(err => {
      res.status(500).send(err);
    });
    await verifyToken.deleteOne();
    console.log(person);
    res.json({ verified: person.verified });
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

router.patch(
  '/profile/follow/:id',
  [helperUser.verifyToken, param('id').exists()],
  async (req, res) => {
    var err = [];
    helperUser.handleValidationResult(req, res, err);
    helperUser.handleInvalidJWT(req, res, err);
    if (err.length > 0) return;

    /* begin logic */

    var followedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { profileFollowers: req.user.id } },
      { new: true }
    ).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });

    /* TODO: replace this with a trigger*/
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { profileFollowing: req.params.id } },
      { new: true }
    ).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });

    /* BEGIN Notification */
    await followUsers(req.user.id, req.params.id, []);
    /* END Notification */
    res.status(200).json({
      message: 'User followed successfully',
      profileFollowers: followedUser.profileFollowers,
    });
  }
);

router.patch(
  '/profile/unfollow/:id',
  [helperUser.verifyToken, param('id').exists()],
  async (req, res) => {
    var err = [];
    helperUser.handleValidationResult(req, res, err);
    helperUser.handleInvalidJWT(req, res, err);
    if (err.length > 0) return;

    /* begin logic */

    var followedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { profileFollowers: req.user.id } },
      { new: true }
    ).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });

    /* TODO: replace this with a trigger*/
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { profileFollowing: req.params.id },
    }).catch(err => {
      res.status(400).send('Err: ' + err);
      return;
    });
    /* BEGIN Notification */
    await unfollowUsers(req.user.id, req.params.id, []);
    /* END Notification */
    res.status(200).json({
      message: 'User unfollowed successfully',
      profileFollowers: followedUser.profileFollowers,
    });
  }
);
module.exports = router;
