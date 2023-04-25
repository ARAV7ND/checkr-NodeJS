import { Router } from "express";
import { login, logout } from "../controllers/auth";
import { validateEmailPassword } from '../middleware/validate-request-schema';

const router = Router();

router.post('/login',
    validateEmailPassword, login);

router.post('/logout', logout);

export default router;
