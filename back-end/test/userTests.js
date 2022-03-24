var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
const { verifyToken } = require('../helpers/helperUser');
var expect = chai.expect;
var userId;
var token;

var user2Id;
var token2;
var emailVerifyToken;

chai.use(chaiHttp);

describe('User Tests', function () {
  describe('Auth for user 1', function () {
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
    });
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
          userId = res.body.user.id;
          expect(res.body.user).to.have.property('email');

          expect(res.body.user.email).to.be.equal('test.user@mail.utoronto.ca');
          done();
        });
    });
  });

  describe('Auth for user 2', function () {
    it('check registaration is functional', function (done) {
      chai
        .request(app)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .send({
          firstName: 'Test2',
          lastName: 'User',
          email: 'test2.user@mail.utoronto.ca',
          password: '123456789',
          role: 'Student',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.be.equal(
            'test2.user@mail.utoronto.ca'
          );
          done();
        });
    });
    it('check login is functional', function (done) {
      chai
        .request(app)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test2.user@mail.utoronto.ca',
          password: '123456789',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          token2 = res.body.token;
          user2Id = res.body.user.id;
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.be.equal(
            'test2.user@mail.utoronto.ca'
          );
          done();
        });
    });
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
    });
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
    });
  });

  describe('Simulate the proccess of user 1 following and unfollowing user 2', function () {
    it('user1 followes user2', function (done) {
      chai
        .request(app)
        .patch(`/users/profile/follow/${user2Id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          console.log(res.body);
          expect(res.body.profileFollowers).to.contain(userId); //user1 should now be one of the followers of user2
          done();
        });
    });
    it('user-1 unfollowes user-2', function (done) {
      chai
        .request(app)
        .patch(`/users/profile/unfollow/${user2Id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${token}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.profileFollowers).to.not.contain(userId); //user1 is no longer a follower of user2
          done();
        });
    });
  });

  describe('check verification email sends', function () {
    it('user1 gets verification email', function (done) {
      chai
        .request(app)
        .get(`/users/send-verification/${userId}`)
        .set('Authorization', `JWT ${token}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('id');
          emailVerifyToken = res.body.token;
          done();
        });
    });
  });
  describe('check email is verified', function () {
    it('user1 gets verification email', function (done) {
      chai
        .request(app)
        .post(`/users/verify`)
        .set('Authorization', `JWT ${token}`)
        .send({ id: userId, token: emailVerifyToken })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('verified');
          done();
        });
    });
  });
});
