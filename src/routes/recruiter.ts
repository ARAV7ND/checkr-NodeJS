import { Router } from "express";
import { addRecruiter, getRecruiterById, getRecruiters } from "../controllers/recruiter";
import { validateRecruiter } from "../middleware/validate-request-schema";
const router = Router();

router.get('/recruiters', getRecruiters);
router.post('/recruiters',
    validateRecruiter, addRecruiter);
router.get('/recruiters/:id', getRecruiterById);


export default router;
