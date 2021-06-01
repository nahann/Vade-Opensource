import { Schema, model, Document } from "mongoose";

export interface IVote extends Document {
    userID: string;
    date: number;
}

const LevelSchema = new Schema({
   userID: String,
    date: Number,
});

const guilds = model<IVote>("votes", LevelSchema);
export default guilds;