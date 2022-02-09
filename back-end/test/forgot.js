var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var User = require('../models/user.model');
var expect = chai.expect;

chai.use(chaiHttp);

describe('/forgot', function () {
  it('check forgot is functional', function (done) {
    chai
      .request(app)
      .post('/forgot')
      .set('Content-Type', 'application/json')
      .send({ email: 'thejohnlewczuk@gmail.com' })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);
});

describe('/forgot', function () {
  it('check forgot returns correct error', function (done) {
    chai
      .request(app)
      .post('/forgot')
      .send("email: 'thejohnlewczuk@gmail.com'")
      .end(function (err, res) {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
});

describe('/forgot/reset', function () {
  it('check reset returns correct error no token', function (done) {
    chai
      .request(app)
      .post('/forgot/reset')
      .set('Content-Type', 'application/json')
      .send({ email: 'thejohnlewczuk@gmail.com' })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);
});
describe('/forgot/reset', function () {
  it('check reset returns correct error invalid token', function (done) {
    chai
      .request(app)
      .post('/forgot/reset')
      .set('Content-Type', 'application/json')
      .send({
        email: 'thejohnlewczuk@gmail.com',
        token: 'xyz12',
        password: 'hhhhhh',
      })
      .end(function (err, res) {
        expect(res).to.have.status(401);
        done();
      });
  }).timeout(5000);
});
