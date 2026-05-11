import express from "express";
const router = express.Router();
import userModel from "../model/user.model";
import redis from "../redis";

router.get("/", async (req, res) => {
  try {
    const cachedUsers = await redis.get("users");

    if (cachedUsers) {
      return res.json({
        source: "redis",
        data: JSON.parse(cachedUsers),
      });
    }

    const users = await userModel.find({});

    await redis.set("users", JSON.stringify(users), "EX", 60);

    return res.json({
      source: "database",
      data: users,
    });
  } catch (err) {
    console.log("Error while fetching user", err);
  }

  res.status(200).json({ message: "Welcome to the Redis and MongoDB App!" });
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const datas = new userModel({
      name,
      email,
      password,
    });

    const result = await datas.save();
    await redis.del("users");

    console.log("result", result);

    res.status(200).json({ message: "Data received successfully!" });
  } catch (err) {
    console.error("Error in POST /:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
