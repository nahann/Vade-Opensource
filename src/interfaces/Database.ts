import mongoose from "mongoose";
import config from "../../config.json";

export default async function connect() {
  try {
    mongoose.connect(
      config.mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        keepAlive: true,
      },
      (err) => {
        if (err) return console.log(err.stack || err.message);
        console.log("Connected to mongo");
      }
    );

    mongoose.connection.on("connect", () => {
      console.log("Mongoose is connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log(err.stack || err.message);
    });

    mongoose.connection.on("disconnect", () => {
      console.log("Mongoose was disconnected");
    });

    mongoose.connection.on("reconnect", () => {
      console.log("Mongoose has reconnected");
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
