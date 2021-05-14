import { Document, Model, model, models, Schema } from "mongoose";

interface IBank extends Document {
  User: string;
  Job: string;
  Wallet: number;
  Bank: number;
  HourlyTime: number;
  DailyTime: number;
  WeeklyTime: number;
  MonthlyTime: number;
  JobSwitchTime: number;
  Wage: number;
  Worked: boolean;
  LastPaid: number;
  Passive: boolean;
  Partner: string;
  MentionNotif: boolean;
}

export const bankSchema = new Schema({
  User: {
    type: String,
    required: true,
  },
  Job: {
    type: String,
    required: false,
  },
  Wage: {
    type: String,
    required: false,
  },
  Passive: {
    type: Boolean,
    required: false,
  },
  Partner: {
    type: String,
    required: false,
  },
  Pet: {
    type: String,
    required: false,
  },
  LastPaid: {
    type: Number,
    required: false,
  },
  Worked: {
    type: Boolean,
    required: false,
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
  JobSwitchTime: {
    type: Number,
    required: false,
  },
  MentionNotif: {
    type: Boolean,
    required: false,
  },
});

const bank =
  (models["econ-storage"] as Model<IBank>) ||
  model<IBank>("econ-storage", bankSchema);

export default bank;
