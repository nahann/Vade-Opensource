import { string } from "joi";
import { Document, Model, model, models, Schema } from "mongoose";

interface IStar extends Document {
  Guild: string;
  Amount: number;
  Channel: string;

}

export const bankSchema = new Schema({
  Guild: {
    type: String,
    required: true,
  },
  Amount: {
      type: Number,
      required: true,
  },
  Channel: {
      type: String,
      required: true,
  }

});

const bank =
  (models["starboards"] as Model<IStar>) ||
  model<IStar>("starboards", bankSchema);

export default bank;
