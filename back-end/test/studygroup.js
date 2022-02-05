const { assert } = require('chai');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

/* Testing that the route '/studygroups' used to fetch all study groups works as desired  */
describe('Study Groups', function () {
  describe('/studygroups', function () {
    it('Returns all studygroups. Responds with status 200', function (done) {
      chai
        .request(app)
        .get('/studygroups')
        .then(res => {
          expect(res).to.have.status(200);
        });
      done();
    }).timeout(5000);
  });
});

/* 
  Testing that the route '/studygroups' used to fetch an individual study group works as desired 
  - Precondition: a study group with id 61fda1d685d6b4b247e54074 exists in the db
*/
describe('Study Group', function () {
  describe('/studygroups/:id', function () {
    it('Returns an individual study group by ID. Responds with status 200', function (done) {
      const groupId = '61fda1d685d6b4b247e54074';
      chai
        .request(app)
        .get(`/studygroups/${groupId}`)
        .then(res => {
          expect(res).to.have.status(200);
        });
      done();
    }).timeout(5000);
  });
});
