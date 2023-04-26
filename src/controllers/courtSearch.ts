import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import CourtSearchModel from '../models/courtSearch';


export const getCourtSeatches = (req: Request, res: Response, next: NextFunction) => {
    CourtSearchModel
        .findAll()
        .then(courtSearches => {
            res.status(200).json({ courtSearches: courtSearches })
        })
        .catch(err => {
            res.status(500).json({ errors: err.message })
        });
}

export const addCourtSearch = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ error: errors.array()[0].msg });
    }
    CourtSearchModel
        .create({
            sex_offender: req.body.sex_offender,
            global_watchlist: req.body.global_watchlist,
            federal_criminal: req.body.federal_criminal,
            country_criminal: req.body.country_criminal,
            candidateId: req.body.candidateId,
        }).then((result) => {
            res.status(200).json({ message: " Court search successfully added", data: result });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        })
}

export const getCourtSearchById = (req: Request, res: Response, next: NextFunction) => {
    CourtSearchModel
        .findByPk(req.params.id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({ message: `court searches not found for : ${req.params.id}` });
            }
            return res.status(200).json({ courtSearches: result })
        })
        .catch(error => {
            res.status(400).json({ error: error })
        })
}

export const updateCourtSearchById = (req: Request, res: Response, next: NextFunction) => {
    CourtSearchModel
        .findByPk(req.params.id)
        .then((courtSearch) => {
            if (!courtSearch) {
                return res.status(404).json({ message: `court searches not found for : ${req.params.id}` });
            }
            courtSearch
                .update({
                    ...courtSearch,
                    ...req.body
                })
                .then(result => res.status(200).json(courtSearch))
                .catch(error => res.status(500).json(error));
        })
        .catch(error => {
            res.status(400).json({ error: error })
        })
};
