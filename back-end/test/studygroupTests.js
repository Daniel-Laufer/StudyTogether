const { assert } = require('chai');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var User = require('../models/user.model');
var StudyGroup = require('../models/studygroup.model');
let token;
let userId;
let studyGroupId;

var expect = chai.expect;

chai.use(chaiHttp);

describe('Studygroup Tests', function () {
  /* hooks */
  after(function () {
    // runs once after the last test in this block
    console.log('--Cleaning up users and study group collections--');
    User.deleteMany({}).catch(err => console.log(err));
    StudyGroup.deleteMany({}).catch(err => console.log(err));
  });

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
          expect(res.body).to.have.property('token');
          token = res.body.token;
          userId = res.body._id;
          done();
        });
    }).timeout(5000);
  });

  /* Test: the route '/studygroups' used to fetch all study groups works as desired  */
  describe('/studygroups', function () {
    it('Check that fetching all study groups is functional', function (done) {
      chai
        .request(app)
        .get('/studygroups')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });

  /* Test: creating a study group */
  describe('/studygroups/create', function () {
    it('Check that creating a new study group is functional', function (done) {
      chai
        .request(app)
        .post('/studygroups/create')
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send({
          title: 'CSC263 Midterm',
          startDateTime: '2022-11-07T17:04:15.000Z',
          endDateTime: '2022-11-07T17:07:15.000Z',
          phone: '905-874-2103',
          imageUrl: '/assets/ewffejvndqj30.jpg',
          location: {
            long: 5,
            lat: 15,
          },
          maxAttendees: 10,
          hostId: '6203414954e004c7a45a944e',
          description: 'We will be going over BFS, DFS and much more!',
          tags: ['Free', 'UTM'],
          recurring: 'weekly',
          finalDate: '2022-11-21T17:04:15.000Z',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          studyGroupId = res.body._id;
          done();
        });
    }).timeout(5000);
  });

  /* Test: Fetching an individual study group */
  describe('/studygroups/:id', function () {
    it('Check that fetching an individual study group is functional', function (done) {
      chai
        .request(app)
        .get(`/studygroups/${studyGroupId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body._id).to.equal(studyGroupId);
          done();
        });
    }).timeout(5000);
  });

  /* Test: Editing a study group */
  describe('/studygroups/edit/:id', function () {
    it('Check that fetching an individual study group is functional', function (done) {
      chai
        .request(app)
        .patch(`/studygroups/edit/${studyGroupId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send({
          delayed: true,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body._id).to.equal(studyGroupId);
          done();
        });
    }).timeout(5000);
  });

  /* Test: Fetching study groups a logged in user is registered to attend */
  describe('/studygroups/registered', function () {
    it('Check that fetching study groups a logged in user is registered to attend is functional', function (done) {
      chai
        .request(app)
        .get('/studygroups/registered')
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });

  /* Test: Attending a study group as a logged in user */
  describe('/studygroups/attend/:id', function () {
    it('Check that attending a study group as a logged in user is functional', function (done) {
      chai
        .request(app)
        .post(`/studygroups/attend/${studyGroupId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });

  /* Test: Leaving a study group that the current logged in user has registered for */
  describe('/studygroups/leave/:id', function () {
    it('Check that leaving a study group that the current logged in user has registered for is functional', function (done) {
      chai
        .request(app)
        .patch(`/studygroups/leave/${studyGroupId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });

  /* Test: Editing a study group */
  describe('/studygroups/delete/:id', function () {
    it('check that the study group deletion is functional', function (done) {
      chai
        .request(app)
        .delete(`/studygroups/delete/${studyGroupId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .send()
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(5000);
  });
});
