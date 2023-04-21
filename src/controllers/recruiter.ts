import { NextFunction, Request, Response } from 'express';
import RecruiterModel from '../models/recruiter';

export const getRecruiters = (req: Request, res: Response, next: NextFunction) => {
    RecruiterModel
        .findAll()
        .then(recruiters => res.status(200).json(recruiters))
        .catch(err => res.status(500).json(err))
}

export const addRecruiter = (req: Request, res: Response, next: NextFunction) => {
    RecruiterModel
        .create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            company: req.body.company,
            password: req.body.password
        })
        .then(result => res.status(201).json(result))
        .catch(err => res.status(400));
}

export const getRecruiterById = (req: Request, res: Response, next: NextFunction) => {
    RecruiterModel
        .findByPk(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: `recruiter not found with ID : ${req.params.id}` })
            }
            return res.status(200).json(result);
        })
        .catch(err => res.status(500).json(err))
}
