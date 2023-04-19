import { CreationOptional, InferCreationAttributes, InferAttributes, Model } from 'sequelize';

export default interface Rectruiter extends Model<InferAttributes<Rectruiter>, InferCreationAttributes<Rectruiter>> {
    id: CreationOptional<number>;
    name: string;
    phone: number;
    address: string;
    company: string;
    email: string;
    password: string;
}
