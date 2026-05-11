import express from "express";

import redis from "../redis";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

    // Publish Message
    await redis.publish(
      "chat",
      message,
    );

    res.json({
      success: true,
      message: "Message Published",
    });
    
  } catch (err) {
    console.log(err);
  }
});

export default router;
