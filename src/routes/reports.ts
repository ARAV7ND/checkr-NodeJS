import { Router } from 'express';
import { addReport, getReportById, getReports, updateReportById } from '../controllers/report';
import { isAuth } from '../middleware/is-auth';

const router = Router();

router.get('/report', isAuth, getReports);
router.get('/report/:id', isAuth, getReportById);
router.post('/report', isAuth, addReport);
router.put('/report/:id', isAuth, updateReportById);

export default router;
