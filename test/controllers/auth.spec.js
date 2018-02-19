/**
 * @fileOverview Auth controller tests
 *
 * @author Franklin Chieze
 *
 * @requires NPM:bcrypt
 * @requires NPM:chai
 * @requires NPM:chai-http
 * @requires ../mock
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

// reg with valid email
// sign up with valid email

describe('AuthController', () => {
  beforeEach(async () => {
    await models.User.destroy({ where: {} });
  });
  describe('POST: /v1/auth/signin', (done) => {
    beforeEach(async () => {
      await models.User.create({
        name: mock.user1.name,
        email: mock.user1.email,
        password: await bcrypt.hash(mock.user1.password, 1)
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
    it('should not sign in user without email', (done) => {
      chai.request(server)
        .post('/v1/auth/signin')
        .send({
          password: mock.user1.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The email field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not sign in user without password', (done) => {
      chai.request(server)
        .post('/v1/auth/signin')
        .send({
          email: mock.user1.email
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The password field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not sign in user with invalid credentials', (done) => {
      chai.request(server)
        .post('/v1/auth/signin')
        .send(mock.user0)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('No user was found with the supplied credentials.');
          expect(res.body.data).to.be.undefined;
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
    it('should not register a user without email', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send({
          name: mock.user1.name,
          password: mock.user1.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The email field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not register a user with malformed email', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send(mock.user1WithMalformedEmail)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The email format is invalid.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not register a user with malformed email [2]', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send(mock.user2WithMalformedEmail)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The email format is invalid.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not register a user with malformed email [3]', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send(mock.user3WithMalformedEmail)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The email format is invalid.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not register a user without name', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send({
          email: mock.user1.email,
          password: mock.user1.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The name field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
    it('should not register a user without password', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send({
          email: mock.user1.email,
          name: mock.user1.name
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('The password field is required.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });

  describe('POST: /v1/auth/signup', (done) => {
    beforeEach(async () => {
      await models.User.create(mock.user1);
    });
    it('should not register a user with an existing email', (done) => {
      chai.request(server)
        .post('/v1/auth/signup')
        .send(mock.user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('errors');
          expect(res.body.errors).to.be.an('Array');
          expect(res.body.errors)
            .to.include('User with the same email already exists.');
          expect(res.body.data).to.be.undefined;
          done();
        });
    });
  });
});
