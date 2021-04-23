import mongoose from "mongoose";

export interface IGuild extends mongoose.Document {
  pot: number;
  entries: string[];
}

const lotterySchema = new mongoose.Schema({
  pot: Number,
  entries: [String],
});

const lottery = mongoose.model<IGuild>("economy-lotter", lotterySchema);

export default lottery;
