import Redis from "ioredis";

const subscriber = new Redis({
  host: "localhost",
  port: 6380,
});

// Subscribe
subscriber.subscribe("chat");
console.log("Subscribed to chat channel");

// Listen Messages
subscriber.on("message", (channel, message) => {
  console.log(`Channel: ${channel}`);
  console.log(`Message: ${message}`);
});
