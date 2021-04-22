import mongoose from 'mongoose';

export interface IGuild extends mongoose.Document {
  pot: Number;
  entires: string[];
}

const lotterySchema = new mongoose.Schema({
  pot: Number,
  entires: [String],
});

const lottery = mongoose.model<IGuild>('economy-lotter', lotterySchema);

export default lottery;
