const { assert } = require('chai');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var expect = chai.expect;
var grp = '';

chai.use(chaiHttp);

/* Test: token validation */
describe('Ensure study groups can not be accessed without a valid JWT token', () => {
  it('401 Unauthorized', done => {
    chai
      .request(app)
      .get('/studygroups')
      .end(function (err, res) {
        expect(res).to.have.status(401);
      });
    done();
  });
});

/* Test: the route '/studygroups' used to fetch all study groups works as desired  */
describe('Study Groups', function () {
  describe('/studygroups', function () {
    it('Returns all studygroups. Responds with status 200', function (done) {
      chai
        .request(app)
        .get('/studygroups')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
        });
      done();
    });
  });
});

/* 
  Test: route '/studygroups' used to fetch an individual study group works as desired 
  - Precondition: a study group with id 61fda1d685d6b4b247e54074 exists in the db
*/
describe('Study Group', function () {
  describe('/studygroups/:id', function () {
    it('Returns an individual study group by ID. Responds with status 200', function (done) {
      const groupId = '62034213b10d3c4264eb84c7';
      chai
        .request(app)
        .get(`/studygroups/${groupId}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
        });
      done();
    });
  });
});

/* Test: creating a study group */
describe('/studygroups/create', function () {
  it('check study group creation is functional', function (done) {
    chai
      .request(app)
      .post('/studygroups/create')
      .set('Content-Type', 'application/json')
      .send({
        title: 'CSC263 Midterm',
        startDateTime: '2022-11-07T17:04:15.000Z',
        endDateTime: '2022-11-07T17:07:15.000Z',
        phone: '905-874-2103',
        imageUrl: '/assets/ewffejvndqj30.jpg',
        location: {
          lng: 5,
          lat: 15,
        },
        maxAttendees: 10,
        hostId: '6203414954e004c7a45a944e',
        description: 'We will be going over BFS, DFS and much more!',
        tags: ['Free', 'UTM'],
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

/* Test: editing a study group */
describe('/studygroups/edit/62018d54b6389a3ed07987d8', function () {
  it('check that the study group edit is functional', function (done) {
    chai
      .request(app)
      .patch('/studygroups/edit/62018d54b6389a3ed07987d8')
      .set('Content-Type', 'application/json')
      .send({
        title: 'CSC263 Exam',
        startDateTime: '2022-11-07T17:04:15.000Z',
        endDateTime: '2022-11-07T17:07:15.000Z',
        phone: '675-874-2103',
        imageUrl: '/assets/ewffejvndqj30.jpg',
        location: {
          lng: 7155,
          lat: 1554,
        },
        maxAttendees: 2,
        hostId: '6203414954e004c7a45a944e',
        description: 'We will be going over BFS, DFS and much more!',
        tags: ['Paid', 'UTM'],
      })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

/* Test: deleting a study group */
describe('/studygroups/delete/62034457d73c46a32c0100e2', function () {
  it('check that the study group deletion is functional', function (done) {
    chai
      .request(app)
      .delete('/studygroups/delete/62034457d73c46a32c0100e2')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});
