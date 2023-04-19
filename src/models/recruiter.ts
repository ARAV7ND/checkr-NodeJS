import { DataTypes } from "sequelize";
import Rectruiter from "../types/recruiter";
import sequelize from "../utils/database";
import CandidateModel from "./candidate";

const RecruiterModel = sequelize.define<Rectruiter>('rectruiter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

RecruiterModel.hasMany(CandidateModel);
CandidateModel.belongsTo(RecruiterModel);

export default RecruiterModel;
