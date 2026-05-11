import { Worker } from "bullmq";

import redis from "../redis";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing Job...");
    console.log("Job Data:", job.data);

    // Fake Long Task
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    console.log("Email Sent Successfully");
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(err);
});
