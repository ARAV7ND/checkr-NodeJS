import { Router } from 'express';
import { addCourtSearch, getCourtSearchById, getCourtSeatches, updateCourtSearchById } from '../controllers/courtSearch';
import { isAuth } from '../middleware/is-auth';
import { validateCourtSearches } from '../middleware/validate-request-schema';

const router = Router();

// have to implement auth for this controller, only accessible by the rectruiter
router.get('/candidates/auth/court-searches', isAuth, getCourtSeatches);

router.post('/candidates/:id/court-searches', validateCourtSearches, isAuth, addCourtSearch);
router.get('/candidates/:id/court-searches', isAuth, getCourtSearchById);
router.patch('/candidates/:id/court-searches', validateCourtSearches, isAuth, updateCourtSearchById);

export default router;
