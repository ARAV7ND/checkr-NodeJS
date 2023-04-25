import express from "express";
import Candidate from '../candiate';
import type { JwtPayload } from "jsonwebtoken"


type User = {
    id: number;
    email: string;
};

declare module "express-session" {
    interface SessionData {
        user: User;
        isLoggedIn: boolean;
        payload: JwtPayload | string;

    }
}
