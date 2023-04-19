
import CourtSearch from '../types/courtSearches';
import sequelize from '../utils/database';
import { DataTypes } from 'sequelize';
import CandidateModel from './candidate';

const CourtSearchModel = sequelize.define<CourtSearch>('court_search', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    sex_offender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    global_watchlist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    federal_criminal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country_criminal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

CourtSearchModel.belongsTo(CandidateModel, {
    constraints: true,
    onDelete: 'CASCADE',
})
CandidateModel.hasOne(CourtSearchModel);

export default CourtSearchModel;
