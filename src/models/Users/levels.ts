import { Schema, model, Document } from "mongoose";

export interface ILevels extends Document {
    userID: string;
    guildID: string;
    xp: number;
    level: number;
    lastUpdated: Date;
}

const LevelSchema = new Schema({
    userID: { type: String },
    guildID: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: new Date() },
});

const guilds = model<ILevels>("Levels", LevelSchema);
export default guilds;