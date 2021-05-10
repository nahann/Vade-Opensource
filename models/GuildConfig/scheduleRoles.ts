import mongoose from "mongoose";

export interface ILog extends mongoose.Document {
  guildID: string;
  roleArray: Array<string>;
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
  guildID: reqString,
  roleArray: reqArray,
});

const guilds = mongoose.model<ILog>(`schedule-roles`, guildSchema);

export default guilds;
