import { NextFunction, Request, Response } from "express";

import redis from "../redis";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip;

    const key = `rate_limit:${ip}`;

    const request = await redis.incr(key);

    if (request === 1) {
      await redis.expire(key, 60);
    }

    if (request > 5) {
      return res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    }

    next();
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Rate Limiter Error",
    });
  }
};

export default rateLimiter;
