import { Router } from 'express';
import { addCourtSearch, getCourtSearchById, getCourtSeatches, updateCourtSearchById } from '../controllers/courtSearch';
import { isAuth } from '../middleware/is-auth';
import { validateCourtSearches } from '../middleware/validate-request-schema';

const router = Router();

router.get('/court-searches', isAuth, getCourtSeatches);
router.post('/court-searches', validateCourtSearches, isAuth, addCourtSearch);
router.get('/court-searches/:id', isAuth, getCourtSearchById);
router.put('/court-searches/:id', validateCourtSearches, isAuth, updateCourtSearchById);

export default router;
