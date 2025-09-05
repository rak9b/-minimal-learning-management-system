import mongoose from "mongoose";
import config from ".";

const databaseConnection = async () => {
  await mongoose.connect(config.database_url as string);
  console.log("Database connected successfully");
};
export default databaseConnection;