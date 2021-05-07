import mongoose from "mongoose";

export interface IReact extends mongoose.Document {
  guildID: string;
  msgid: string;
  roleid: string;
  reaction: string;
  dm: boolean;
  option: number;
}

const guildSchema = new mongoose.Schema({
  guildID: String,
  msgid: String,
  roleid: String,
  reaction: String,
  dm: Boolean,
  option: Number,
});

const guilds = mongoose.model<IReact>("reaction-roles", guildSchema);

export default guilds;
