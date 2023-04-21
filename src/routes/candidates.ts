import { Router } from 'express';
import { addCandidate, getCandidateById, getCandidates, updateCandidate } from '../controllers/candidate';

const router = Router();

router.get('/candidates', getCandidates);
router.post('/candidates', addCandidate);
router.get('/candidates/:id', getCandidateById);
router.put('/candidates/:id', updateCandidate);

export default router;
