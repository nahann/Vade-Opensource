import mongoose from "mongoose";

export interface IPlaying extends mongoose.Document {
  userID: string;
  gameName: string;
}

const guildSchema = new mongoose.Schema({
  userID: String,
  gameName: String,
});

const guilds = mongoose.model<IPlaying>("game-players", guildSchema);

export default guilds;
