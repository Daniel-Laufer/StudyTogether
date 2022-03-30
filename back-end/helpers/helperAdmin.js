var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var tarequest = require('../models/taverify.model');
var reports = require('../models/reports.model');
const adminurl = 'http://localhost:8000/admin';

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
  async renderreports(req, res) {
    var userReports = await reports.find({});
    res.render('reports', {
      title: 'Reports',
      message: 'Manage user reports',
      url: adminurl,
      reports: userReports,
      token: req.body.token,
    });
  },
  async renderonereport(req, res, rep, accused, reporter) {
    console.log('her2e');
    if (rep.reportType == 'User') {
      res.render('oneuserreport', {
        title: 'Report',
        message: 'Dispense justice, no partiality',
        url: adminurl,
        rep: rep,
        reporter: reporter,
        accused: accused,
      });
    } else if (rep.reportType == 'Group') {
      res.render('onegroupreport', {
        title: 'Report',
        message: 'Dispense justice, no partiality',
        url: adminurl,
        rep: rep,
        reporter: reporter,
        accused: accused,
      });
    }
  },
};
