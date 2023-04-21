import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export type status = "consider" | "clear" | "adjudication" | "cancelled";

export default interface CourtSearch extends Model<InferAttributes<CourtSearch>, InferCreationAttributes<CourtSearch>> {
    id: CreationOptional<number>,
    sex_offender: status,
    global_watchlist: status,
    federal_criminal: status,
    country_criminal: status,
    candidateId: CreationOptional<number>,
}
