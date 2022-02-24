var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var helperUser = require('../helpers/helperUser');
var User = require('../models/user.model');
var expect = chai.expect;
let token;

chai.use(chaiHttp);

describe('User Tests', function () {
  /* hooks */
  after(function () {
    // runs once after the last test in this block
    console.log('--Cleaning up users collection--');
    User.deleteMany({}).catch(err => console.log(err));
  });

  /* Test: token validation */
  describe('Ensure users are not accessable unless valid JWT token is provided', function () {
    it('verifies status is 403 Forbidden', function (done) {
      chai
        .request(app)
        .get('/users')
        .end(function (err, res) {
          expect(res).to.have.status(403);
        });
      done();
    });
  });

  /* Test: register user */
  describe('/users/register', function () {
    it('check registaration is functional', function (done) {
      chai
        .request(app)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test.user@mail.utoronto.ca',
          password: '123456789',
          role: 'Student',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.user).to.be.a('object');

          expect(res.body).to.have.property('token');
          expect(res.body.user).to.have.property('email');

          expect(res.body.user.email).to.be.equal('test.user@mail.utoronto.ca');
          done();
        });
    }).timeout(5000);
  });

  /* Test: User login*/
  describe('/users/login', function () {
    it('check login is functional', function (done) {
      chai
        .request(app)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test.user@mail.utoronto.ca',
          password: '123456789',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.user).to.be.a('object');

          expect(res.body).to.have.property('token');
          token = res.body.token;
          expect(res.body.user).to.have.property('email');

          expect(res.body.user.email).to.be.equal('test.user@mail.utoronto.ca');
          done();
        });
    }).timeout(5000);
  });

  /* Test: User Bookmark Study group */
  describe('/users/bookmark-group', function () {
    it('check study group bookmarking is functional', function (done) {
      chai
        .request(app)
        .post('/users/bookmark-group')
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send({
          studygroupId: '62018d7ab6389a3ed07987db',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });

  /* Test: User Unbookmark Study group */
  describe('/users/unbookmark-group', function () {
    it('check study group bookmarking is functional', function (done) {
      chai
        .request(app)
        .patch('/users/unbookmark-group')
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send({
          studygroupId: '62018d7ab6389a3ed07987db',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });
});
