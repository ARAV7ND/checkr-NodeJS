import { DataTypes } from "sequelize";
import Session from "../types/session";
import sequelize from "../utils/database";

const SessionModel = sequelize.define<Session>("Session", {
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
});

export default SessionModel;
