var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var tarequest = require('../models/taverify.model');
const adminurl = `${process.env.BACK_END_URI}/admin`;

module.exports = {
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
