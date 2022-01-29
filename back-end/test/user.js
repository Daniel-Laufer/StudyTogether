var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/users', function() {
    it('Returns user Tobey Maguire. Responds with status 200', function(done) {
      chai.request(app)
        .get('/users')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.firstName).to.equal("Tobey")
          expect(res.body.lastName).to.equal("Maguire")
          expect(res.body.email).to.equal("Tobey.Maguire@mail.utoronto.ca")
          expect(res.body.role).to.equal("student")
          expect(res.body.verified).to.equal(false)
          done();
        });
    });
  });
});