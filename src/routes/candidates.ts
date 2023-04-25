import { Router } from 'express';
import { addCandidate, getCandidateById, getCandidates, updateCandidate } from '../controllers/candidate';
import { isAuth } from '../middleware/is-auth';
import { validateCandidateDetails } from '../middleware/validate-request-schema';

const router = Router();
router.get('/candidates', isAuth, getCandidates);
router.post('/candidates',
    validateCandidateDetails, isAuth, addCandidate);
router.get('/candidates/:id', isAuth, getCandidateById);
router.put('/candidates/:id',
    validateCandidateDetails, isAuth, updateCandidate);

export default router;
