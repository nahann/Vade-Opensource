import mongoose from "mongoose";

export interface IGuild extends mongoose.Document {
  _id: string;
  guildID: string;
  guildName: string;
  prefix: string;
  welcomeChannel: string;
  welcomeMessage: string;
  welcomeType: string;
  logChannelID: string;
  Suggestion: string;
  ModRole: Array<string>;
  AdminRole: Array<string>;
  AntiAlt: boolean;
  AntiAltDays: number;
  reactionDM: boolean;
  cleanCommands: boolean;
}

const guildSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  prefix: String,
  welcomeChannel: String,
  welcomeMessage: String,
  welcomeType: String,
  logChannelID: String,
  Suggestion: String,
  ModRole: Array,
  AdminRole: Array,
  AntiAlt: Boolean,
  AntiAltDays: Number,
  reactionDM: Boolean,
  cleanCommands: Boolean,
});

const guilds = mongoose.model<IGuild>(`Guild`, guildSchema, "vade-guilds");

export default guilds;
