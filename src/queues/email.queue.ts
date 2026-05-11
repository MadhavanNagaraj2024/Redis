import { Queue } from "bullmq";
import redis from "../redis";

const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

export default emailQueue;
