import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import bcrypt from 'bcryptjs';
import CandidateModel from '../src/models/candidate';
import { app } from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Login API', () => {
  let candidateId: number;

  before(async () => {
    // Create a candidate for testing purposes
    const hashedPassword = await bcrypt.hash('testPassword', 10);
    await CandidateModel.create({
      email: 'testemail@example.com',
      password: hashedPassword,
      name: 'Test',
      phone: 123456,
      social_security_no: "132134",
      driving_license: "124682",

    });
  });

  it('should return an error if email is not provided', (done) => {
    chai.request(app)
      .post('/login')
      .send({ password: 'testPassword' })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.error).to.equal('Invalid email address. Please try again.');
        done();
      });
  });

  it('should return an error if password is not provided', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'testemail@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.error).to.equal('Password must be longer than 6 characters.');
        done();
      });
  });

  it('should return an error if email is invalid', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'invalidemail', password: 'testPassword' })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.error).to.equal('Invalid email address. Please try again.');
        done();
      });
  });

  it('should return an error if password is incorrect', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'testemail@example.com', password: 'wrongPassword' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Please enter valid password and email combination');
        done();
      });
  });

  it('should login a user successfully', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'testemail@example.com', password: 'testPassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Login successful');
        expect(res).to.have.cookie('connect.sid');
        done();
      });
  });
});

describe('Logout API', () => {
  it('should logout a user successfully', (done) => {
    chai.request(app)
      .post('/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Successfully logged out');
        expect(res).to.not.have.cookie('connect.sid');
        done();
      });
  });
});
