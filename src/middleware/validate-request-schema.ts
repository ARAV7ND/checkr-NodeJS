import { body } from "express-validator";
import CandidateModel from "../models/candidate";
import RecruiterModel from '../models/recruiter';

export const validateEmailPassword = [
    body('email', 'Invalid email address. Please try again.')
        .isEmail(),
    body('password', 'Password must be longer than 6 characters.')
        .isLength({ min: 6 })
        .isAlphanumeric(),
];

export const validateNamePhone = [
    body('name', "name cannot be null").exists({ checkFalsy: true }),
    body('phone', "phone no must be longer than 6 digits")
        .exists({ checkFalsy: true })
        .isNumeric()
        .isLength({ min: 6 }),
];

export const validateCandidateDetails = [
    ...validateNamePhone,
    ...validateEmailPassword,
    body('social_security_no', "social security no cannot be null")
        .exists({ checkFalsy: true }),
    body('driving_license', "driving_license cannot be null")
        .exists({ checkFalsy: true }),
    body('email')
        .isEmail()
        .custom((value, { req }) => {
            return CandidateModel
                .findOne({ where: { email: value } })
                .then((candidate) => {
                    if (candidate) {
                        return Promise.reject("Email address is already in use");
                    }
                })
        })
];

export const validateRecruiter = [
    ...validateNamePhone,
    ...validateEmailPassword,
    body('address', "address cannot be null").exists({ checkFalsy: true }),
    body('company', "company cannot be null").exists({ checkFalsy: true }),
    body('email')
        .isEmail()
        .custom((value, { req }) => {
            return RecruiterModel
                .findOne({ where: { email: value } })
                .then((result) => {
                    if (result) {
                        return Promise.reject("Email address is already in use");
                    }
                })
        })
];

export const validateCourtSearches = [
    body('sex_offender', "sex_offender status cannot be null")
        .exists({ checkFalsy: true }),
    body('global_watchlist', "global_watchlist status cannot be null")
        .exists({ checkFalsy: true }),
    body('federal_criminal', "federal_criminal status cannot be null")
        .exists({ checkFalsy: true }),
    body('country_criminal', "country_criminal status cannot be null")
        .exists({ checkFalsy: true }),
];
