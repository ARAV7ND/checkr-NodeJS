import { DataTypes } from "sequelize";
import Candidate from "../types/candiate";
import sequelize from "../utils/database";

const CandidateModel = sequelize.define<Candidate>('candidate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    social_security_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    driving_license: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DOB: {
        type: DataTypes.DATE,
    },
    pin_code: {
        type: DataTypes.INTEGER,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default CandidateModel;
