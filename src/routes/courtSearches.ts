import { Router } from 'express';
import { addCourtSearch, getCourtSearchById, getCourtSeatches, updateCourtSearchById } from '../controllers/courtSearch';

const router = Router();

// have to implement auth for this controller, only accessible by the rectruiter
router.get('/candidates/auth/court-searches', getCourtSeatches);

router.post('/candidates/:id/court-searches', addCourtSearch);
router.get('/candidates/:id/court-searches', getCourtSearchById);
router.patch('/candidates/:id/court-searches', updateCourtSearchById);

export default router;
