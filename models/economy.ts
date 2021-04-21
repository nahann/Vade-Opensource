import { Document, Model, model, models, Schema } from "mongoose";

interface IBank extends Document {
  User: string;
  Wallet: number;
  Bank: number;
  HourlyTime: number;
  DailyTime: number;
  WeeklyTime: number;
  MonthlyTime: number;
}

export const bankSchema = new Schema({
  User: {
    type: String,
    required: true,
  },
  Wallet: {
    type: Number,
    required: true,
  },
  Bank: {
    type: Number,
    required: true,
  },
  HourlyTime: {
    type: Number,
    required: false,
  },
  DailyTime: {
    type: Number,
    required: false,
  },
  WeeklyTime: {
    type: Number,
    required: false,
  },
  MonthlyTime: {
    type: Number,
    required: false,
  },
});

const bank =
  (models["econ-storage"] as Model<IBank>) ||
  model<IBank>("econ-storage", bankSchema);

export default bank;
