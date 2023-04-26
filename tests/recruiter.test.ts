import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import RecruiterModel from '../src/models/recruiter';
import { app } from '../src/app';

chai.use(chaiHttp);
describe('addRecruiter', () => {
    const email = 'john.doe@example.com';

    afterEach(async () => {
        // Clear all records in the Recruiter table
        await RecruiterModel.destroy({ where: { email: email } });
    });

    it('should return a 201 status code and the created recruiter', async () => {
        const recruiterData = {
            name: 'John Doe',
            phone: 1234567890,
            email: email,
            address: '123 Main St, Anytown USA',
            company: 'Example Inc.',
            password: 'password'
        };

        const res = await chai
            .request(app)
            .post('/recruiters')
            .send(recruiterData);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('name', recruiterData.name);
        expect(res.body).to.have.property('phone', recruiterData.phone);
        expect(res.body).to.have.property('email', recruiterData.email);
        expect(res.body).to.have.property('address', recruiterData.address);
        expect(res.body).to.have.property('company', recruiterData.company);
    });

    it('should return a 422 status code and an error message for invalid input', async () => {
        const recruiterData = {
            name: 'John Doe',
            phone: 1234567890,
            email: email,
            address: '123 Main St, Anytown USA',
            company: 'Example Inc.',
            password: '' // invalid input - password is required
        };

        const res = await chai
            .request(app)
            .post('/recruiters')
            .send(recruiterData);
        expect(res.status).to.equal(422);
        expect(res.body).to.have.property('error', 'Password must be longer than 6 characters.');
    });

    describe('getRecruiterById', () => {
        let recruiter: any;
        before(async () => {
            recruiter = await RecruiterModel.create({
                name: 'John Doe',
                phone: 1234567890,
                email: email,
                address: '123 Main St, Anytown USA',
                company: 'Example Inc.',
                password: 'password'
            })
        })
        it('should return a recruiter when given a valid ID', (done) => {
            chai
                .request(app)
                .get(`/recruiters/${recruiter.id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.name).to.equal('John Doe');
                    expect(res.body.email).to.equal('john.doe@example.com');
                    done();
                });
        });

        it('should return an error when given an invalid ID', (done) => {
            chai
                .request(app)
                .get('/recruiters/5893')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.an('object');
                    expect(res.body.message).to.equal('recruiter not found with ID : 5893');
                    done();
                });
        });
    });

    describe('GET /recruiters', () => {
        it('should return all recruiters', (done) => {
            chai.request(app)
                .get('/recruiters')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});
