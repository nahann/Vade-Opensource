import mongoose from "mongoose";

export interface IVote extends mongoose.Document {
  User: string;
  Time: number;
  Enabled: boolean;
  Messaged: boolean;
}

const Schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  User: String,
  Time: Number,
  Enabled: Boolean,
  Messaged: Boolean,
});

const main = mongoose.model<IVote>(`Vote-reminders`, Schema);

export default main;
