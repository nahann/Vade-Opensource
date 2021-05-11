import mongoose from "mongoose";

export interface ILog extends mongoose.Document {
  guildname: string;
  guildID: string;
  channelName: string;
  channelID: string;
  type: Array<string>;
}

const reqString = {
  type: String,
  required: true,
};
const reqArray = {
  type: Array,
  required: true,
};

const guildSchema = new mongoose.Schema({
  guildname: reqString,
  guildID: reqString,
  channelName: reqString,
  channelID: reqString,
  type: Array,
});

const guilds = mongoose.model<ILog>(`logging-channels`, guildSchema);

export default guilds;
