import mongoose from "mongoose";

export interface IPLaylist extends mongoose.Document {
    username: string;
    userID: string;
    playlistName: string;
    playlistArray: Array<string>;
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
    username: String,
    userID: reqString,
    playlistName: reqString,
    playlistArray: reqArray,
});

const guilds = mongoose.model<IPLaylist>("playlists", guildSchema);

export default guilds;
