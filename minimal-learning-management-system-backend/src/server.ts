import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import config from "./config";
import databaseConnection from "./config/db";

const serverBootstrap = async () => {
  try {
    // Database connection
    await databaseConnection();
    const server: Server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    // exist server
    const existServerHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed successfully");
          process.exit(1);
        });
      } else {
        console.error("Server is not running");
        process.exit(1);
      }
    };
    // Handle uncaught exceptions
    const handleUncaughtException = (error: Error) => {
      console.error("Uncaught Exception:", error);
      existServerHandler();
    };

    process.on("uncaughtException", handleUncaughtException);
    // Handle unhandled rejections
    process.on("unhandledRejection", (error: Error) => {
      console.error("Unhandled Rejection:", error);
      existServerHandler();
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

serverBootstrap();
