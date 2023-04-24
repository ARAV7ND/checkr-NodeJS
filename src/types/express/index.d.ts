import express from "express";
import Candidate from '../candiate';


type User = {
    id: number;
    email: string;
};

declare module "express-session" {
    interface SessionData {
        user: User;
        isLoggedIn: boolean;

    }
}
