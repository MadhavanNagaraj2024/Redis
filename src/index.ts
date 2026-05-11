import redis from "./redis";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(express.json());

import catchingRouter from "./routes/catching.route";
import distibutedRouter from "./routes/distibutedLocking.route";
import rateLimiter from "./middleware/rateLimiter";
import "./workers/email.worker";
import emailRouter from "./routes/email.route";

//Routes Configuration
app.use(rateLimiter);
app.use("/api/catching", catchingRouter);
app.use("/distibuted", distibutedRouter);
app.use("/bulMq/email", emailRouter);

// Mongo DB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/redis-app")
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// App Port Listening
app.listen(process.env.PORT, async () => {
  console.log("Server is running on port " + process.env.PORT);

  await redis.set("backend", "nodejs");
});
