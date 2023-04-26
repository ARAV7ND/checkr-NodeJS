import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcryptjs';
import CandidateModel from '../src/models/candidate';
import { app } from '../src/app';
import ReportModel from '../src/models/report';

chai.use(chaiHttp);

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
    candidateId = candidate.id;
    const loginResponse = await chai.request(app)
        .post('/login')
        .send({
            email: 'testemail@example.com',
            password: 'testPassword'
        })
    token = loginResponse.body.token;
});

describe('POST /report', () => {

    it('should add a report', async () => {
        const report = {
            status: 'Pending',
            adjudication: 'clear',
            candidateId: 1,
        };

        const response = await chai
            .request(app)
            .post('/report')
            .send(report)
            .set('Authorization', `Bearer ${token}`);


        expect(response.status).to.equal(200);
        expect(response.body.result.status).to.equal(report.status);
        expect(response.body.result.adjudication).to.equal(report.adjudication);
        expect(response.body.result.candidateId).to.equal(report.candidateId);

        await ReportModel.destroy({ where: { id: response.body.result.id } });
    });
});

describe('getReportById', () => {
    let reportId: number;

    beforeEach(async () => {
        const report = await ReportModel.create({
            status: 'clear',
            adjudication: 'clear',
            candidateId: candidateId
        });
        reportId = report.id;
    });

    afterEach(async () => {
        await ReportModel.destroy({ where: { id: reportId } });
    });

    it('should return a report with valid ID', async () => {
        const res = await chai
            .request(app)
            .get(`/report/${reportId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
    });

    it('should return 404 for invalid ID', async () => {
        const res = await chai
            .request(app)
            .get('/report/99990')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Report not found with ID : 99990');
    });

    it('should return 404 for invalid request', async () => {
        const res = await chai.request(app)
            .get('/report/invalid')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(404);
        expect(res.body.err).to.not.be.null;
    });
});

describe('getReports function', () => {
    before(async () => {
        await ReportModel.create({
            status: 'clear',
            adjudication: 'consider',
            candidateId: 1,
        });
    });

    it('should retrieve all reports with associated candidate information', (done) => {
        chai.request(app)
            .get('/report')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res.body.report.length).to.be.greaterThanOrEqual(1);
                expect(res.body.report[0]).to.have.property('status', 'clear');
                expect(res.body.report[0]).to.have.property('adjudication', 'consider');
                done();
            });
    });

    after(async () => {
        await ReportModel.destroy({ where: { candidateId: 1 } });
    });
});

describe('updateReportById', () => {
    it('should update the report with the specified ID', async () => {
        const report = await ReportModel.create({
            status: 'clear',
            adjudication: 'clear',
            candidateId: 1
        });

        const response = await chai
            .request(app)
            .put(`/report/${report.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed', adjudication: 'approved' });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('completed');
        expect(response.body.adjudication).to.equal('approved');
    });

    it('should return 404 if report not found', async () => {
        const response = await chai
            .request(app)
            .put('/report/999')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed', adjudication: 'approved' });

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('message').to.equal('report not found with ID : 999');
    });

    after(async () => {
        await ReportModel.destroy({ where: { candidateId: 1 } });
    });
});
