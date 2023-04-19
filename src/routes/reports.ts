import { Router } from 'express';
import { addReport, getReportById, getReports, updateReportById } from '../controllers/report';

const router = Router();

// auth router
router.get('/candidates/auth/report', getReports);

router.get('/candidates/:id/report', getReportById);
router.post('/candidates/:id/report', addReport);
router.put('/candidates/:id/report', updateReportById);

export default router;
