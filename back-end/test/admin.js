var bcrypt = require('bcrypt');
var User = require('../models/user.model');
var chaiHttp = require('chai-http');

var saltRounds = 8;
var app = require('../app');
var chai = require('chai');
var expect = chai.expect;
chai.use(chaiHttp);
let token;

describe('Studygroup Tests', function () {
  it('setup', function (done) {
    var admin = new User({
      firstName: 'ad',
      lastName: 'min',
      email: 'admin@study.ca',
      username: 'admininstrator' ?? null,
      verified: false,
      password: bcrypt.hashSync('admin', saltRounds),
      role: 'Admin',
    });
    admin.save();
    console.log(admin);
    done();
  });

  describe('/admin/login', function () {
    it('check login is functional', function (done) {
      chai
        .request(app)
        .post('/admin/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'admin@study.ca',
          password: 'admin',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          token = res.header.token;
          done();
        });
    }).timeout(10000);
    it('check requests page is functional', function (done) {
      chai
        .request(app)
        .post('/admin/requests')
        .set('Content-Type', 'application/json')
        .send({
          token: token,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('check users page is functional', function (done) {
      chai
        .request(app)
        .post('/admin/users')
        .set('Content-Type', 'application/json')
        .send({
          token: token,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
