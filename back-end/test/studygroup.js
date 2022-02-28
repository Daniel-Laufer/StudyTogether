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
    var agent = chai.request.agent(app);
    agent
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({

        firstName: 'Test',
        lastName: 'User',
        email: 'test.use@mail.utoronto.ca',
        password: '123456789',
        role: 'Student',

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
      .then(async function (res) {
        expect(res.body).to.have.property('token');
        const res_1 = await agent
          .post('/studygroups/create')
          .set('Content-Type', 'application/json')
          .set('authorization', `JWT ${res.body.token}`)
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
          });
        expect(res_1).to.have.status(200);
        done();
      });
  });
});

/* Test: editing a study group */
describe('/studygroups/edit/62018d54b6389a3ed07987d8', function () {
  it('check study group edit is functional', function (done) {
    var agent = chai.request.agent(app);
    agent
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({

        firstName: 'Testing',
        lastName: 'User2',
        email: 'test.use2@mail.utoronto.ca',
        password: '123456789',
        role: 'Student',

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
      .then(async function (res) {
        expect(res.body).to.have.property('token');
        const res_1 = await agent
          .post('/studygroups/create')
          .set('Content-Type', 'application/json')
          .set('authorization', `JWT ${res.body.token}`)
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
          .then(async function (res) {
            const res_2 = await agent
              .patch(`/studygroups/edit/${res.body.group_id}`)
              .set('Content-Type', 'application/json')
              .set('authorization', `${res.body.authorization}`)
              .send({
                title: 'CSC263 Exam',
                startDateTime: '2022-11-07T17:04:15.000Z',
                endDateTime: '2022-11-07T17:07:15.000Z',
                phone: '675-874-2103',
                imageUrl: '/assets/ewffejvndqj30.jpg',
                location: {
                  long: 7155,
                  lat: 1554,
                },
                maxAttendees: 2,
                hostId: '6203414954e004c7a45a944e',
                description: 'We will be going over BFS, DFS and much more!',
                tags: ['Paid', 'UTM'],
                recurring: 'N/A',
                finalDate: '2022-11-07T17:07:15.000Z',
                editAll: true,
              });
            expect(res_2).to.have.status(200);
            done();
          });
      });


  });

});

/* Test: deleting a study group */
describe('/studygroups/delete/62034457d73c46a32c0100e2', function () {
  it('check study group edit is functional', function (done) {
    var agent = chai.request.agent(app);
    agent
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Testing',
        lastName: 'User3',
        email: 'test.use3@mail.utoronto.ca',
        password: '123456789',
        role: 'Student',
      })
      .then(async function (res) {
        expect(res.body).to.have.property('token');
        const res_1 = await agent
          .post('/studygroups/create')
          .set('Content-Type', 'application/json')
          .set('authorization', `JWT ${res.body.token}`)
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
          .then(async function (res) {
            const res_2 = await agent
              .delete(`/studygroups/delete/${res.body.group_id}`)
              .set('Content-Type', 'application/json')
              .set('authorization', `${res.body.authorization}`)
              .send({
                deleteAll: true,
              });
            expect(res_2).to.have.status(200);
            done();
          });
      });
  });
});
