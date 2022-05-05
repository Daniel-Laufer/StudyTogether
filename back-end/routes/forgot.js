var express = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var router = express.Router();
let user = require('../models/user.model');
let Token = require('../models/token.model');
const { body, validationResult } = require('express-validator');
const helperUser = require('../helpers/helperUser');
const resetURL = `${process.env.FRONTEND_URI}/reset-password`; //to be replaced with the proper frontend page

router.post('/', body('email').notEmpty(), async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email } = req.body;
  let person = await user.findOne({ email: `${email}` });
  if (!person) {
    res.send('Email not in system');
    return;
  }

  //code taken from https://blog.logrocket.com/implementing-a-secure-password-reset-in-node-js/
  await Token.findOneAndDelete({ userId: person._id });
  var saltRounds = 8;
  var salt = await bcrypt.genSalt(saltRounds);
  let resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, salt);
  await new Token({
    email: email,
    token: hash,
    createdAt: Date.now(),
  }).save();
  const link = `${resetURL}?token=${resetToken}&email=${email}`;
  // end of code taken from

  //email code taken from https://nodemailer.com/about/
  helperUser.sendEmail(
    email,
    'Password reset request',
    `Click this link to reset your password: ${link}`
  );
  res.send('email sent\nemail: ' + email + '\nlink: ' + link);
});

//this router.post was taken from https://blog.logrocket.com/implementing-a-secure-password-reset-in-node-js/
router.post(
  '/reset',
  body('email').notEmpty(),
  body('password').notEmpty().isLength({ min: 6 }),
  body('token').notEmpty(),

  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const email = req.body.email;
    console.log(req.body.password);
    let passwordResetToken = await Token.findOne({ email: `${email}` });
    if (!passwordResetToken || passwordResetToken.length == 0) {
      res.status(401).send('No token was sent for validation');
      return;
    }

    const isValid = bcrypt.compareSync(
      req.body.token,
      passwordResetToken.token
    );
    if (!isValid) {
      res.status(401).send('Invalid token');
      return;
    }

    var saltRounds = 8;

    user.updateOne(
      { email: `${email}` },
      { password: bcrypt.hashSync(req.body.password, saltRounds) },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated docs: ', docs);
        }
      }
    );

    await passwordResetToken.deleteOne();
    res.send('Password updated');
  }
);

module.exports = router;
