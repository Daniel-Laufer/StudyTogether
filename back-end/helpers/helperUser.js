var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var tarequest = require('../models/taverify.model');
const adminurl = 'http://localhost:8000/admin';
module.exports = {
  respondJWT(user, res, successMessage) {
    /* Create a token by signing the user id with the private key. */
    var token = jwt.sign(
      { id: user._id, date: Date.now },
      process.env.JWT_SECRET,
      { expiresIn: 3600 } // token expires every 60 mins
    );

    /* Send the token back to client + some user info */
    res.status(200).json({
      user: {
        //user info
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      message: successMessage,
      token: token,
    });
  },

  /* To determine if token was verified, we check req.user is not null in the endpoint*/
  verifyToken(req, res, next) {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET,
        function (err, decode) {
          if (err) {
            req.user = undefined;
            console.log(err);
            next();
          }

          User.findOne({
            _id: decode.id, //this is the id we originally encoded with our JWT_SECRET
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            } else {
              req.user = user;
              next();
            }
          });
        }
      );
    } else {
      req.user = undefined;
      next();
    }
  },
  verifyTokenInBody(req, res, next) {
    if (req.body.token) {
      jwt.verify(
        req.body.token,
        process.env.JWT_SECRET,
        function (err, decode) {
          if (err) {
            req.user = undefined;
            console.log(err);
            next();
          }

          User.findOne({
            _id: decode.id, //this is the id we originally encoded with our JWT_SECRET
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            } else {
              req.user = user;
              next();
            }
          });
        }
      );
    } else {
      req.user = undefined;
      next();
    }
  },

  async renderusers(req, res) {
    var users = await User.find({});
    var list = [];
    for (x in users) {
      list.push(users[x].firstName + ' ' + users[x].lastName + ' ');
    }
    res.render('users', {
      title: 'Users',
      message: 'Manage users',
      url: adminurl,
      users: users,
      token: req.body.token,
    });
  },
  async renderrequests(req, res) {
    var requests = await tarequest.find({});
    var list = [];
    for (x in requests) {
      list.push(requests[x].firstName + ' ' + requests[x].lastName + ' ');
    }
    res.render('requests', {
      title: 'Requests',
      message: 'Manage TA verification requests',
      url: adminurl,
      requests: requests,
      token: req.body.token,
    });
  },
  renderadminlogin(req, res, err, code) {
    res.status(code).render('login', {
      title: 'Login',
      url: adminurl,
      errors: err,
    });
  },
};
