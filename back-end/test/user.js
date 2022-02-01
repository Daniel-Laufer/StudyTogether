const { assert } = require('chai');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function () {
  describe('/users', function () {
    it('Returns all users. Responds with status 200', function (done) {
      chai
        .request(app)
        .get('/users')
        .then(res => {
          expect(res).to.have.status(200);
        });
      done();
    }).timeout(5000);
  });
});
