import mongoose from "mongoose";

export interface IGuild extends mongoose.Document {
  _id: string;
  guildID: string;
  roleID: string;
  gameName: string;
 
}

const guildSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  gameName: String,
  roleID: String,

});

const guilds = mongoose.model<IGuild>("linked-games", guildSchema);

export default guilds;
