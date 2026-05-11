import express from "express";
import emailQueue from "../queues/email.queue";
const router = express.Router();

router.post(
  "/send-email",

  async (req, res) => {
    try {
      const { email } = req.body;

      // Add Job To Queue
      await emailQueue.add(
        "sendEmail",
        {
          email,
        },
        {
          attempts: 3,
        },
      );

      res.json({
        success: true,
        message: "Email Job Added To Queue",
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  },
);

export default router;
