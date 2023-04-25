import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export default interface Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
    sid: string;
    userId: string;
    expires: Date;
    data: Date;
}
