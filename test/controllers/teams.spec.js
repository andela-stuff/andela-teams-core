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
        .get('/v1/teams/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Array');
          done();
        });
    });
  });
});
