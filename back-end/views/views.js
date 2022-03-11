var express = require('express');
var jwt = require('jsonwebtoken');
const user = require('../models/user.model');
var router = express.Router();
var bcrypt = require('bcrypt');
const { check, body, validationResult } = require('express-validator');
const adminurl = 'http://localhost:8000/admin';

var helperUser = require('../helpers/helperUser');
const taverify = require('../models/taverify.model');

router.get('/', (req, res) => {
  res.render('login', '');
});

router.post(
  '/login',
  body('email').exists().bail().notEmpty().bail().isEmail(),
  body('password').exists().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = JSON.stringify({ errors: errors.array() });
      console.log(err);
      helperUser.renderadminlogin(req, res, err, 400);
      return;
    }
    console.log(req.body.email);
    user.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        helperUser.renderadminlogin(req, res, err, 500);
        return;
      } else if (!user) {
        helperUser.renderadminlogin(req, res, 'Admin not found!', 404);
        return;
      }

      /* 2. Vaidating password */
      var passwordIsCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsCorrect) {
        helperUser.renderadminlogin(req, res, 'Password invalid', 401);
        return;
      }

      if (user.role != 'Admin') {
        helperUser.renderadminlogin(req, res, 'Must be an admin', 401);
        return;
      }
      /* 3. Send JWT back to client*/
      var token = jwt.sign(
        { id: user._id, date: Date.now },
        process.env.JWT_SECRET,
        { expiresIn: 3600 } // token expires every 60 mins
      );
      res.status(200).set('token', token).render('index', {
        title: 'Admin view',
        url: adminurl,
        errors: err,
        token: token,
      });
    });
  }
);

router.post('/verify/:id', async (req, res) => {
  console.log(req.body);
  if (req.body.reject) {
    taverify.findByIdAndDelete(request._id).catch(err =>
      res
        .status(500)
        .render('requests', {
          title: 'Requests',
          url: adminurl,
          errors: err,
        })
        .json(err)
    );
  } else if (req.body.accept) {
    let request = await taverify.findById(req.params.id);
    let person = await user.findById(request.userid);

    person.role = 'TA';
    request.delete();
    person.save().catch(err =>
      res
        .status(500)
        .render('requests', {
          title: 'Requests',
          url: adminurl,
          errors: err,
        })
        .json(err)
    );
  }

  helperUser.renderrequests(req, res);
});

router.get('/users', async (req, res) => {
  helperUser.renderusers(req, res);
});

router.get('/requests', async (req, res) => {
  helperUser.renderrequests(req, res);
});

router.get('/ban/:id', async (req, res) => {
  let personid = req.params.id;
  var person = await user.findById(personid);
  person.banned = true;
  person.save().catch(err => res.status(500).json(err));
  console.log('deleting ' + person.firstName);
  helperUser.renderusers(req, res);
});

router.get('/unban/:id', async (req, res) => {
  let personid = req.params.id;
  var person = await user.findById(personid);
  person.banned = false;
  person.save().catch(err => res.status(500).json(err));
  console.log('restoring ' + person.firstName);
  helperUser.renderusers(req, res);
});

module.exports = router;
