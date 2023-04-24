import { Request, Response, NextFunction } from 'express';
import CandidateModel from '../models/candidate';
import ReportModel from '../models/report';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const getCandidates = (req: Request, res: Response, next: NextFunction) => {
    CandidateModel
        .findAll({
            include: [{
                model: ReportModel,
                required: false
            }]
        })
        .then(candidates => {
            res.status(200).json({
                candidates: candidates
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
}

export const addCandidate = async (req: Request, res: Response, next: NextFunction) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ error: errors.array()[0].msg });
    }
    CandidateModel
        .create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            social_security_no: req.body.social_security_no,
            driving_license: req.body.driving_license,
            DOB: req.body.DOB,
            pin_code: req.body.pin_code,
            password: hashedPassword,
        }).then(result => {
            res.status(201).json(result)
        }).catch(error => {
            res.status(400).json({ err: error });
        })
}

export const getCandidateById = (req: Request, res: Response, next: NextFunction) => {
    CandidateModel
        .findByPk(req.params.id)
        .then(candidate => {
            if (!candidate) {
                return res.status(404).json({ message: `candidate not found with ID : ${req.params.id}` });
            }
            return res.status(200).json({ candidate: candidate });
        }).catch(error => {
            res.status(404).json(error);
        })
}

export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    CandidateModel
        .findByPk(req.params.id)
        .then((candidate) => {
            if (!candidate) {
                return res.status(404).json({ message: `candidate not found with ID : ${req.params.id}` });
            }
            candidate
                .update({
                    ...candidate,
                    ...req.body
                })
                .then(candidate => res.status(200).json(candidate))
                .catch(error => res.status(error).json(error));
        })
        .catch(error => res.status(400).json({ error: error }));
}
