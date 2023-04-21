
import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';
import Report from '../types/report';
import CandidateModel from './candidate';

const ReportModel = sequelize.define<Report>('report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adjudication: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    turn_around_time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

ReportModel.belongsTo(CandidateModel, {
    constraints: true,
    onDelete: 'CASCADE',
});
CandidateModel.hasOne(ReportModel);

export default ReportModel;
