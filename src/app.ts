import express, { Application } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRoutes from './routes/auth';
import userRoutes from './routes/candidates';
import courtSearchRoutes from './routes/courtSearches';
import reportRoutes from './routes/reports';
import recruiterRoutes from './routes/recruiter';
import sequelize from './utils/database';
import dotenv from 'dotenv';


const config = dotenv.config({ path: './config.env' });

export const app: Application = express();
app.disable("x-powered-by");
const PORT = config.parsed!.PORT || 8000;
const SECRET = config.parsed!.SECRET || 'somesecret';
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(bodyParser.json());
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: true,
        store: new SequelizeStore({
            db: sequelize,
        }),
    }));

app.use(authRoutes);
app.use(userRoutes);
app.use(courtSearchRoutes);
app.use(reportRoutes);
app.use(recruiterRoutes);


sequelize
    .sync()
    .then((result: any) => {
        app.listen(PORT, (): void => {
            console.log(`Server Running here : http://localhost:${PORT}`);
        });
    }).catch((err: any) => {
        console.log("connection error", err);
    });
