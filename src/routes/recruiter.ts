import { Router } from "express";
import { addRecruiter, getRecruiterById, getRecruiters } from "../controllers/recruiter";

const router = Router();

router.get('/recruiters', getRecruiters);
router.post('/recruiters', addRecruiter);
router.get('/recruiters/:id',getRecruiterById);


export default router;
