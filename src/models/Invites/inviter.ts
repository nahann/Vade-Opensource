import { Schema, model } from "mongoose";

export interface IInviter extends Document {
    guildID: String,
    userID: String,
    total: Number,
    regular: Number,
    bonus: Number,
    leave: Number,
    fake: Number,
  }

const schema = new Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    total: { type: Number, default: 0, min: 0 },
    regular: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    leave: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 },
});

const guild = model<IInviter>("inviter", schema);

export default guild;
