import mongoose from "mongoose";

export interface IBlacklist extends mongoose.Document {
  User: string;
  Reason: string;
  Active: boolean;
}

const reqString = {
  type: String,
  required: true,
};
const reqArray = {
  type: Array,
  required: true,
};

const reqBoo = {
  type: Boolean,
  required: true,
};

const guildSchema = new mongoose.Schema({
  User: reqString,
  Reason: reqString,
  Active: reqBoo,
});

const guilds = mongoose.model<IBlacklist>("blacklist", guildSchema);

export default guilds;
