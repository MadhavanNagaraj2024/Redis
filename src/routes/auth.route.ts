import express from "express";
import redis from "../redis";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fake User Validation
    if (email !== "admin@gmail.com" || password !== "1234") {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Generate Session ID
    const sessionId = Math.random().toString(36).substring(2);

    // Store Session In Redis
    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        email,
      }),
      "EX",
      3600,
    );

    res.json({
      success: true,
      message: "Login Success",
      sessionId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.headers.sessionid;
    await redis.del(`session:${sessionId}`);

    res.json({
      success: true,
      message: "Logged Out",
    });
    
  } catch (err) {
    console.log(err);
  }
});

export default router;
