import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
const config = dotenv.config({ path: './config.env' });

const sequelize = new Sequelize(config.parsed!.DATABASE,
    config.parsed!.DATABASE_USER,
    config.parsed!.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: config.parsed!.ENV,
    logging: false,
});

export default sequelize;
