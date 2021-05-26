import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    User: String,
    endDate: String,
  },
  { timestamps: true }
);

const model = mongoose.model("premium-users", Schema);

export default model;
