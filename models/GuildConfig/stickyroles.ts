import mongoose from "mongoose";

export interface ISticky extends mongoose.Document {
  guildID: string;
  roles: Array<any>;
  blacklist: Array<string>;
  enabled: boolean;
}

const reqString = {
  type: String,
  required: true,
};
const reqArray = {
  type: Array,
  required: true,
};
const reqBoo = {
  type: Boolean,
  required: true,
};

const stickySchema = new mongoose.Schema({
  guildID: reqString,
  roles: reqArray,
  blacklist: reqArray,
  enabled: reqBoo,
});

const guilds = mongoose.model<ISticky>("sticky-roles", stickySchema);

export default guilds;
