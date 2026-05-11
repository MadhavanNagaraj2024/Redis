import express from "express";
const router = express.Router();
import redis from "../redis";

router.post("/create-order", async (req, res) => {
  try {
    // Lock Request
    const lock = await redis.set("order_lock", "locked", "EX", 10, "NX");

    if (!lock) {
      return res.status(409).json({
        success: false,
        message: "Another request is processing",
      });
    }
    
    console.log("Processing Order");

    // Fake Processing
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    res.json({
      success: true,
      message: "Order Created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  } finally {
    // Release Lock
    await redis.del("order_lock");
  }
});

export default router;
