import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/candidates';
import courtSearchRoutes from './routes/courtSearches';
import reportRoutes from './routes/reports';
import recruiterRoutes from './routes/recruiter';
import sequelize from './utils/database';
import dotenv from 'dotenv';


const config = dotenv.config({ path: './config.env' });

const app: Application = express();
const PORT = config.parsed!.PORT || 8000;

app.use(bodyParser.json());
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
