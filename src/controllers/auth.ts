import { NextFunction, Request, Response } from "express";
import CandidateModel from "../models/candidate";
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";

export const login = (req: Request, res: Response, next: NextFunction) => {
    let userId: number;
    let email: string = req.body.email;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({ error: errors.array()[0].msg });
    }

    CandidateModel.
        findOne({ where: { email: email } })
        .then(candidate => {
            if (candidate) {
                userId = candidate.id;
                return bcrypt.compare(req.body.password, candidate.password);
            }
        })
        .then(isMatched => {
            if (isMatched) {
                req.session.user = {
                    id: userId,
                    email: req.body.email
                }
                req.session.isLoggedIn = true;
                return res.status(200).json({ message: "login successful" });
            }
            res.status(400).json({ message: "please enter valid password and email combination" })
        })
        .catch(error => res.status(error).json(error));
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "successfully logged out" });
    });
};
