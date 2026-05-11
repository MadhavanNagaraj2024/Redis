import express from "express";

import authMiddleware from "../middleware/auth.middleware";

interface AuthenticatedRequest extends express.Request {
  user?: any;
}

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,

  async (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,

      user: req.user,
    });
  },
);

export default router;
