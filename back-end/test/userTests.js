var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var helperUser = require('../helpers/helperUser');
var User = require('../models/user.model');
var expect = chai.expect;

chai.use(chaiHttp);

describe('User Tests', function () {
  /* hooks */
  after(function () {
    // runs once after the last test in this block
    console.log('--Cleaning up users collection--');
    User.deleteMany({}).catch(err => console.log(err));
  });

  /* Test token validation */
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

  /* register user test */
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

  /* login user test - TBA */
});
