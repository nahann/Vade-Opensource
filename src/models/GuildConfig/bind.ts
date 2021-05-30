import { Schema, Document, model } from 'mongoose';

const reqString = {
    type: String,
    required: true,
};
const reqArray = {
    type: Array,
    required: true,
};

export interface IBind extends Document {
    guildname: string;
    guildID: string;
    textChannelArr: string[];
    voiceChannelID: string;
    roleID: string;
}

const bindSchema = new Schema({
    guildname: String,
    guildID: String,
    textChannelArr: reqArray,
    voiceChannelID: reqString,
    roleID: reqString,
});

const guilds = model<IBind>("binds", bindSchema);
export default guilds;