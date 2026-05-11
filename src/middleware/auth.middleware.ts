import { Request, Response, NextFunction } from "express";

import redis from "../redis";

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {

  try {
    const sessionId = req.headers.sessionid;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Session ID Missing",
      });
    }

    // Check Redis Session
    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid Session",
      });
    }

    req.user = JSON.parse(session);

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export default authMiddleware;
