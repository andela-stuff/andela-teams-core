import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../build/server';

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('UsersController', () => {
  describe('GET: /v1/users', (done) => {
    it('should respond with an array', (done) => {
      chai.request(server)
        .get('/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });

  describe('GET: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .get('/v1/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('DELETE: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .delete('/v1/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });

  describe('POST: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .post('/v1/users')
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

  describe('PUT: /v1/users/:userId', (done) => {
    it('should respond with an object', (done) => {
      chai.request(server)
        .put('/v1/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('name');
          done();
        });
    });
  });
});
