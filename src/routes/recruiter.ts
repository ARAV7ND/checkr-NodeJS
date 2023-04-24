import { Router } from "express";
import { addRecruiter, getRecruiterById, getRecruiters } from "../controllers/recruiter";
import { isAuth } from "../middleware/is-auth";
import { validateRecruiter } from "../middleware/validate-request-schema";
const router = Router();

router.get('/recruiters', isAuth, getRecruiters);
router.post('/recruiters',
    validateRecruiter, isAuth, addRecruiter);
router.get('/recruiters/:id', isAuth, getRecruiterById);


export default router;
