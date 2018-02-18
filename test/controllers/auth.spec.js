/**
 * @fileOverview Auth controller tests
 *
 * @author Franklin Chieze
 *
 * @requires NPM:bcrypt
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires ../../build/models
 * @requires ../../build/server
 */

import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';

import mock from '../mock';
import models from '../../build/models';
import server from '../../build/server';

const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe('AuthController', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {}, truncate: true });
  });
  describe('POST: /v1/auth/signin', (done) => {
    beforeEach(async () => {
      models.User.create({
        name: mock.user1.name,
        email: mock.user1.email,
        password: await bcrypt.hash(mock.password, 1)
      });
    });
    it('should return a user token on successful sign in', (done) => {
      chai.request(server)
        .post('/v1/auth/signin')
        .send(mock.user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.name).to.equal(mock.user1.name);
          expect(res.body.data.user.email).to.equal(mock.user1.email);
          res.body.data.user.should.not.have.property('password');
          res.body.data.should.have.property('userToken');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });

  describe('POST: /v1/auth/signup', (done) => {
    it('should register a new user', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send(mock.user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          expect(res.body.data).to.be.an('Object');
          res.body.data.should.have.property('user');
          expect(res.body.data.user.id).to.not.be.undefined;
          expect(res.body.data.user.name).to.equal(mock.user1.name);
          expect(res.body.data.user.email).to.equal(mock.user1.email);
          res.body.data.user.should.not.have.property('password');
          res.body.data.should.have.property('userToken');
          expect(res.body.errors).to.be.undefined;
          done();
        });
    });
  });
});
