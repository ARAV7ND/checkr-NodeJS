import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const config = dotenv.config({ path: './config.env' });
const SECRET = config.parsed!.SECRET || 'somesecret';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }

    jwt.verify(token, SECRET, (err, token) => {
        if (err) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        req.session.payload = token;
        next();
    });

}
