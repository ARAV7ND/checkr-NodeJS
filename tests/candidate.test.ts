import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import bcrypt from 'bcryptjs';
import { app } from '../src/app';
import CandidateModel from '../src/models/candidate';
import Candidate from '../src/types/candiate';


chai.use(chaiHttp);

const expect = chai.expect;

describe('candidate controller', () => {
    let email: string;
    let candidateId: number;
    let token: string;
    beforeEach(async () => {
        // Create a candidate for testing purposes
        const hashedPassword = await bcrypt.hash('testPassword', 10);
        const candidate = await CandidateModel.create({
            email: 'testemail@example.com',
            password: hashedPassword,
            name: 'Test',
            phone: 123456,
            social_security_no: "132134",
            driving_license: "124682",

        });
        email = candidate.email;
        const loginResponse = await chai.request(app)
            .post('/login')
            .send({
                email: 'testemail@example.com',
                password: 'testPassword'
            })
        token = loginResponse.body.token;
    });
    afterEach(async () => {
        // remove the test user after the tests complete
        await CandidateModel.destroy({
            where: {
                email: email,
            },
        });
    });

    describe('Get Candidates API', () => {
        it('should return 401 unauthorized without a valid session token', (done) => {
            chai.request(app)
                .get('/candidates')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should get all candidates successfully', (done) => {
            chai.request(app)
                .get('/candidates')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.candidates).to.be.an('array');
                    expect(res.body.candidates.length).to.be.greaterThan(0);

                    // validating structure candidate model 
                    res.body.candidates.forEach((candidate: Candidate) => {
                        expect(candidate).to.have.property('id');
                        expect(candidate).to.have.property('name');
                        expect(candidate).to.have.property('email');
                        expect(candidate).to.have.property('phone');
                        expect(candidate).to.have.property('social_security_no');
                        expect(candidate).to.have.property('driving_license');
                        expect(candidate).to.have.property('password');
                    });
                    done();
                });
        });
    });

    describe("addCandidate", () => {
        it("should add a new candidate", (done) => {
            chai
                .request(app)
                .post("/candidates")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: "Test1",
                    email: "testemail1@example.com",
                    phone: "123456",
                    social_security_no: "132134",
                    driving_license: "124682",
                    password: "123456"
                }).end((resErr, res) => {
                    email = res.body.email;
                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property("id");
                    expect(res.body.name).to.equal("Test1");
                    expect(res.body.email).to.equal("testemail1@example.com");
                    expect(res.body.phone).to.equal("123456");
                    expect(res.body.social_security_no).to.equal("132134");
                    expect(res.body.driving_license).to.equal("124682");
                    done();
                });
        });

        it("should return an error if request body is invalid", (done) => {
            chai
                .request(app)
                .post("/candidates")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: "John Doe",
                    email: "invalid email",
                    phone: "1234567890",
                    social_security_no: "123-45-6789",
                    driving_license: "DL12345678",
                    pin_code: "123456",
                    password: "password123",
                }).end((resErr, res) => {
                    expect(res.status).to.equal(422);
                    expect(res.body).to.have.property("error");
                    expect(res.body.error).to.equal("Invalid email address. Please try again.");
                    done();
                });
        });
    });

    describe('get individual candidate', () => {
        it('GET /candidates/:id', (done) => {
            chai
                .request(app)
                .get(`/candidates/1`)
                .set('Authorization', `Bearer ${token}`)
                .end((resErr, res) => {
                    expect(res.status).to.equal(200);
                    expect(Object.keys(res.body.candidate).length).to.be.greaterThan(0);
                    done();
                });
        });

        it('should return a 404 status if candidate is not found', (done) => {

            chai
                .request(app)
                .get(`/candidates/100`)
                .set('Authorization', `Bearer ${token}`)
                .end((resErr, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('candidate not found with ID : 100')
                    done();
                })

        });
    });

    describe('updateCandidate', () => {
        it('should update candidate information', async () => {
            const candidate = await CandidateModel.create({
                name: 'John Doe',
                email: 'john@example.com',
                phone: 1234567890,
                social_security_no: '123-45-6789',
                driving_license: '12345678',
                password: 'password'
            });
            const updatedCandidate = {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                phone: 1234567890,
                social_security_no: '987-65-4321',
                driving_license: '87654321',
                password: 'newPassword'
            };

            chai.request(app)
                .put(`/candidates/${candidate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedCandidate)
                .end(async (resError, response) => {
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.an('object');
                    expect(response.body.name).to.equal(updatedCandidate.name);
                    expect(response.body.email).to.equal(updatedCandidate.email);
                    expect(response.body.phone).to.equal(updatedCandidate.phone);
                    expect(response.body.social_security_no).to.equal(updatedCandidate.social_security_no);
                    expect(response.body.driving_license).to.equal(updatedCandidate.driving_license);
                    expect(await bcrypt.compare(updatedCandidate.password, response.body.password)).to.be.true;
                });

        });

        it('should return 404 if candidate not found', (done) => {
            chai.request(app)
                .put('/candidates/999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Jane Doe',
                    email: 'jane.doe@example.com',
                    phone: '987-654-3210',
                    social_security_no: '987-65-4321',
                    driving_license: '87654321',
                    password: 'newPassword'
                }).end((resError, response) => {
                    expect(response).to.have.status(404);
                    expect(response.body).to.be.an('object');
                    expect(response.body.message).to.equal('candidate not found with ID : 999');
                    done();
                })

        });

    });
});
