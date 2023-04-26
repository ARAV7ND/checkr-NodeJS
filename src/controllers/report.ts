import { NextFunction, Request, Response } from "express";
import CandidateModel from "../models/candidate";
import ReportModel from "../models/report";

export const getReports = (req: Request, res: Response, next: NextFunction) => {
  ReportModel
    .findAll({
      include: [{
        model: CandidateModel,
        required: true
      }]
    })
    .then((result) => {
      res.status(200).json({ report: result });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

export const addReport = (req: Request, res: Response, next: NextFunction) => {
  ReportModel
    .create({
      status: req.body.status,
      adjudication: req.body.adjudication,
      candidateId: req.body.candidateId,
    })
    .then((result) => {
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
}

export const getReportById = (req: Request, res: Response, next: NextFunction) => {
  ReportModel
    .findByPk(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: `Report not found with ID : ${req.params.id}` });
      }
      return res.status(200).json({ report: result });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
}

export const updateReportById = (req: Request, res: Response, next: NextFunction) => {
  ReportModel
    .findByPk(req.params.id)
    .then((report) => {
      if (!report) {
        return res.status(404).json({ message: `report not found with ID : ${req.params.id}` });
      }
      report
        .update({
          ...report,
          ...req.body
        })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}
