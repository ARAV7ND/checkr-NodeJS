import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize"


export default interface Candidate extends Model<InferAttributes<Candidate>, InferCreationAttributes<Candidate>> {
    id: CreationOptional<number>,
    name: string,
    email: string,
    phone: number,
    password: string,
    social_security_no: string,
    driving_license: string,
    DOB: CreationOptional<Date>,
    pin_code: CreationOptional<number>
}
