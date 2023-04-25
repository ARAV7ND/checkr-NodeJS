import { Router } from 'express';
import { addReport, getReportById, getReports, updateReportById } from '../controllers/report';
import { isAuth } from '../middleware/is-auth';

const router = Router();

router.get('/candidates/auth/report', isAuth, getReports);

router.get('/candidates/:id/report', isAuth, getReportById);
router.post('/candidates/:id/report', isAuth, addReport);
router.put('/candidates/:id/report', isAuth, updateReportById);

export default router;
