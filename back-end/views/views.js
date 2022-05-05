var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var bcrypt = require('bcrypt');
const { check, body, validationResult } = require('express-validator');
const adminurl = `${process.env.BACK_END_URI}/admin`;

var helperUser = require('../helpers/helperUser');
const taverify = require('../models/taverify.model');
const User = require('../models/user.model');

router.get('/', helperUser.verifyTokenInBody, (req, res) => {
  if (req.user) {
    res.render('index', { token: req.body.token });
  } else {
    res.render('login', '');
  }
});
router.post('/', helperUser.verifyTokenInBody, (req, res) => {
  if (req.user) {
    res.render('index', { token: req.body.token });
  } else {
    res.render('login', '');
  }
});

router.post(
  '/login',
  body('email').exists().bail().notEmpty().bail().isEmail(),
  body('password').exists().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = JSON.stringify({ errors: errors.array() });
      console.log(err);
      helperUser.renderadminlogin(req, res, err, 400);
      return;
    }
    User.findOne({ email: req.body.email }).exec((err, admin) => {
      if (err) {
        helperUser.renderadminlogin(req, res, err, 500);
        return;
      } else if (!admin) {
        helperUser.renderadminlogin(req, res, 'Admin not found!', 404);
        return;
      }

      /* 2. Vaidating password */
      var passwordIsCorrect = bcrypt.compareSync(
        req.body.password,
        admin.password
      );
      if (!passwordIsCorrect) {
        helperUser.renderadminlogin(req, res, 'Password invalid', 401);
        return;
      }

      if (admin.role != 'Admin') {
        helperUser.renderadminlogin(req, res, 'Must be an admin', 401);
        return;
      }
      /* 3. Send JWT back to client*/
      var token = jwt.sign(
        { id: admin._id, date: Date.now },
        process.env.JWT_SECRET,
        { expiresIn: 3600 } // token expires every 60 mins
      );
      res.status(200).set('token', token).render('index', {
        title: 'Admin view',
        message: 'Manage system',
        url: adminurl,
        errors: err,
        token: token,
        userid: admin.id,
      });
    });
  }
);

router.post('/verify/:id', helperUser.verifyTokenInBody, async (req, res) => {
  if (!req.user) {
    res.status(401).render('login', { message: 'Please login again' });
    return;
  }

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
    let person = await User.findById(request.userid);

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

router.post('/users', helperUser.verifyTokenInBody, async (req, res) => {
  if (!req.user) {
    res.status(401).render('login', { message: 'Please login again' });
    return;
  }
  helperUser.renderusers(req, res);
});

router.post('/requests', helperUser.verifyTokenInBody, async (req, res) => {
  if (!req.user) {
    res.status(401).render('login', { message: 'Please login again' });
    return;
  }
  helperUser.renderrequests(req, res);
});

router.post('/ban/:id', helperUser.verifyTokenInBody, async (req, res) => {
  if (!req.user) {
    res.status(401).render('login', { message: 'Please login again' });
    return;
  }
  let personid = req.params.id;
  var person = await User.findById(personid);
  person.banned = true;
  person.save().catch(err => res.status(500).json(err));
  helperUser.renderusers(req, res);
});

router.post('/unban/:id', helperUser.verifyTokenInBody, async (req, res) => {
  if (!req.user) {
    res.status(401).render('login', { message: 'Please login again' });
    return;
  }
  let personid = req.params.id;
  var person = await User.findById(personid);
  person.banned = false;
  person.save().catch(err => res.status(500).json(err));
  helperUser.renderusers(req, res);
});

module.exports = router;
