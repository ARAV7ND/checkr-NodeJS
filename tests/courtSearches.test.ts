import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import bcrypt from 'bcryptjs';
import Sinon from 'sinon';
import CandidateModel from '../src/models/candidate';
import { app } from '../src/app';
import CourtSearchModel from '../src/models/courtSearch';


chai.use(chaiHttp);
const expect = chai.expect;
describe("court Seatches API", () => {

    let candidate: any;
    let token: string;
    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash('testPassword', 10);
        candidate = await CandidateModel.create({
            name: 'Test User',
            email: 'testemail@example.com',
            phone: 1234567890,
            social_security_no: '123-45-6789',
            driving_license: 'A1234567',
            password: hashedPassword,
        });

        const loginResponse = await chai.request(app)
            .post('/login')
            .send({
                email: 'testemail@example.com',
                password: 'testPassword'
            })
        token = loginResponse.body.token;
    });

    afterEach(async () => {
        await CourtSearchModel.destroy({ where: { candidateId: candidate.id } });
        await CandidateModel.destroy({ where: { email: candidate.email } });
    });
    describe('addCourtSearch', () => {

        it('should add a new court search for the candidate', async () => {
            const courtSearch = {
                sex_offender: "clear",
                global_watchlist: "clear",
                federal_criminal: "dispute",
                country_criminal: "clear",
                candidateId: candidate.id,
            };
            const res = await chai
                .request(app)
                .post(`/court-searches`)
                .set('Authorization', `Bearer ${token}`)
                .send(courtSearch);
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal(' Court search successfully added');
            expect(res.body.data.sex_offender).to.equal(courtSearch.sex_offender);
            expect(res.body.data.global_watchlist).to.equal(courtSearch.global_watchlist);
            expect(res.body.data.federal_criminal).to.equal(courtSearch.federal_criminal);
            expect(res.body.data.country_criminal).to.equal(courtSearch.country_criminal);
            expect(Number(res.body.data.candidateId)).to.equal(candidate.id);
        });

        it('should return an error for invalid input', async () => {
            const courtSearch = {
                sex_offender: "clear",
                global_watchlist: "",
                federal_criminal: "clear",
                country_criminal: "clear",
            };
            const res = await chai
                .request(app)
                .post(`/court-searches`)
                .set('Authorization', `Bearer ${token}`)
                .send(courtSearch);
            expect(res.status).to.equal(422);
            expect(res.body.error).to.equal('global_watchlist status cannot be null');
        });
    });

    describe('getCourtSeatches', () => {
        before(async () => {
            await CourtSearchModel.bulkCreate([
                {
                    sex_offender: "clear",
                    global_watchlist: "consider",
                    federal_criminal: "consider",
                    country_criminal: "cancelled",
                    candidateId: 1,
                },
                {
                    sex_offender: "adjudication",
                    global_watchlist: "cancelled",
                    federal_criminal: "cancelled",
                    country_criminal: "clear",
                    candidateId: 2,
                },
            ]);
        });
        afterEach(async () => {
            await CourtSearchModel.destroy({ where: { candidateId: [1, 2] } });
        });

        it('should return a list of court searches', (done) => {
            chai
                .request(app)
                .get('/court-searches')
                .set('Authorization', `Bearer ${token}`)
                .end((resError, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.courtSearches[0].sex_offender).to.equal("clear");
                    expect(res.body.courtSearches[0].global_watchlist).to.equal("consider");
                    expect(res.body.courtSearches[0].federal_criminal).to.equal("consider");
                    expect(res.body.courtSearches[0].country_criminal).to.equal("cancelled");
                    expect(res.body.courtSearches[0].candidateId).to.equal(1);
                    expect(res.body.courtSearches[1].sex_offender).to.equal("adjudication");
                    expect(res.body.courtSearches[1].global_watchlist).to.equal("cancelled");
                    expect(res.body.courtSearches[1].federal_criminal).to.equal("cancelled");
                    expect(res.body.courtSearches[1].country_criminal).to.equal("clear");
                    expect(res.body.courtSearches[1].candidateId).to.equal(2);
                    done();
                })
        });


        it('should return an error for internal server error', (done) => {
            const mockFindAll = Sinon
                .stub(CourtSearchModel, 'findAll')
                .throws(new Error('Internal server error'));

            chai
                .request(app)
                .get('/court-searches')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res.status).to.equal(500);
                    mockFindAll.restore();
                    done();
                });
        });

    });

    describe("getCourtSeachesById", () => {
        let courtSearch: any;
        before(async () => {
            courtSearch = await CourtSearchModel
                .create({
                    sex_offender: "clear",
                    global_watchlist: "consider",
                    federal_criminal: "consider",
                    country_criminal: "cancelled",
                    candidateId: 1,
                });
        })
        after(async () => {
            await CourtSearchModel.destroy({ where: { candidateId: 1 } });
        });

        it('should return a court search by id', async () => {
            chai
                .request(app)
                .get(`/court-searches/${courtSearch.id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.courtSearches.sex_offender).to.equal(courtSearch.sex_offender);
                    expect(res.body.courtSearches.global_watchlist).to.equal(courtSearch.global_watchlist);
                    expect(res.body.courtSearches.federal_criminal).to.equal(courtSearch.federal_criminal);
                    expect(res.body.courtSearches.country_criminal).to.equal(courtSearch.country_criminal);
                });
        });

        it('should return an error for non-existent court search ID', (done) => {
            const nonExistentId = '1234567890';
            chai
                .request(app)
                .get(`/court-searches/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal(`court searches not found for : ${nonExistentId}`);
                    done();
                });
        });
    });


    describe('updateCourtSearchById', () => {
        let courtSearch: any;

        before(async () => {
            courtSearch = await CourtSearchModel.create({
                sex_offender: "cancelled",
                global_watchlist: "clear",
                federal_criminal: "consider",
                country_criminal: "adjudication",
            });
        });

        it('should update a court search by id', async () => {
            const res = await chai
                .request(app)
                .put(`/court-searches/${courtSearch.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    sex_offender: "cancelled",
                    global_watchlist: "clear"
                });

            expect(res.status).to.equal(200);
            expect(res.body.sex_offender).to.equal("cancelled");
            expect(res.body.global_watchlist).to.equal("clear");
        });

        it('should return an error if court search is not found', async () => {
            const res = await chai
                .request(app)
                .put('/court-searches/9999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    global_watchlist: "consider"
                });

            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('court searches not found for : 9999');
        });
        after(async () => {
            await CourtSearchModel.destroy({ where: { id: courtSearch.id } });
        });
    });
})

