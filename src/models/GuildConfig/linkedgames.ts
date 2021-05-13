import mongoose from "mongoose";

export interface IGame extends mongoose.Document {
  guildID: string;
  roleID: string;
  gameName: string;
 
}

const guildSchema = new mongoose.Schema({
  guildID: String,
  gameName: String,
  roleID: String,

});

const guilds = mongoose.model<IGame>("linked-games", guildSchema);

export default guilds;
