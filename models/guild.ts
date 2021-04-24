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
  ModRole: string;
  AdminRole: string;
  AntiAlt: boolean;
  AntiAltDays: number;
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
  ModRole: String,
  AdminRole: String,
  AntiAlt: Boolean,
  AntiAltDays: Number,
});

const guilds = mongoose.model<IGuild>(`Guild`, guildSchema, "vade-guilds");

export default guilds;
