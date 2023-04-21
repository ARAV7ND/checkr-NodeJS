import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { status } from './courtSearches';

export default interface Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
    id: CreationOptional<number>,
    status: status,
    adjudication: status,
    completed_date: CreationOptional<Date>,
    turn_around_time: CreationOptional<string>,
    candidateId: CreationOptional<number>,
}
