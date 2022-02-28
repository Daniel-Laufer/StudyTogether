var app = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

module.exports = {
  registerTestUser({ token }) {
    chai
      .request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Tod',
        lastName: 'Smith',
        email: 'Tod.Smith@mail.utoronto.ca',
        password: '123456789',
        role: 'Student',
      })
      .end(function (err, res) {
        console.log(res.body);
        token = res.body.token;
        // expect(res).to.have.status(200);
        // expect(res.body).to.be.a('object');
        // expect(res.body.user).to.be.a('object');
        // expect(res.body).to.have.property('token');
        // expect(res.body.user).to.have.property('email');
        // expect(res.body.user.email).to.be.equal('test.user@mail.utoronto.ca');
        // done();
      });
  },
};
