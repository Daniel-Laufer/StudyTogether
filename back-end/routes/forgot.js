var express = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var router = express.Router();
let user = require('../models/user.model');
let Token = require('../models/token.model');
const { body, validationResult } = require('express-validator');
const resetURL = 'http://localhost:3000/forgot'; //to be replaced with the proper frontend page

let password = process.env.password;

router.post('/', body('email').notEmpty(), async function (req, res) {
  const errors = validationResult(req);
  console.log('here');
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
  console.log('compare' + bcrypt.compareSync(resetToken, hash));
  console.log(resetToken);
  await new Token({
    email: email,
    token: hash,
    createdAt: Date.now(),
  }).save();
  const link = `${resetURL}?token=${resetToken}&email=${email}`;
  // end of code taken from

  //email code taken from https://nodemailer.com/about/
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'studtogtest@gmail.com',
      pass: password,
    },
    secure: true,
  });
  let msg = await transporter.sendMail({
    from: 'studtogtest@gmail.com', // sender address
    to: `${email}`, // list of receivers
    subject: 'Password Reset Request',
    text: `Click this link to reset your password: ${link}`,
  });
  await transporter.sendMail(msg);

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
      console.log('123');
      return;
    }

    const isValid = bcrypt.compareSync(
      req.body.token,
      passwordResetToken.token
    );
    if (!isValid) {
      res.status(403).send('Invalid token');
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
