import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../build/server';

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('TeamsController', () => {
  describe('GET: /v1/teams', (done) => {
    it('should respond with an array', (done) => {
      chai.request(app)
        .get('/v1/teams')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .get('/v1/teams/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('DELETE: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .delete('/v1/teams/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('POST: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .post('/v1/teams')
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('PUT: /v1/teams/:teamId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .put('/v1/teams/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId/members', (done) => {
    it('should respond with an array', (done) => {
      chai.request(app)
        .get('/v1/teams/1/members')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });

  describe('GET: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .get('/v1/teams/1/members/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('DELETE: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .delete('/v1/teams/1/members/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('POST: /v1/teams/:teamId/members', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .post('/v1/teams/1/members')
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });

  describe('PUT: /v1/teams/:teamId/members/:memberId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(app)
        .put('/v1/teams/1/members/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('teamId');
          expect(res.body.data.teamId).to.be.a('Number');
          res.body.data.should.have.property('userId');
          expect(res.body.data.userId).to.be.a('Number');
          res.body.data.should.have.property('role');
          expect(res.body.data.role).to.be.a('String');
          done();
        });
    });
  });
});
