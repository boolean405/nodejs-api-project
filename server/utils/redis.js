require("dotenv").config();

// localhost Redis
// const Redis = require("async-redis");

// server Redis
const redis = require("ioredis");

const Redis = new redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
})
  .on("connect", () => {
    console.log("Success, Redis Server Connected");
  })
  .on("error", (error) => {
    console.error("Failed, to connect to Redis Server: ", error.message);
  })
  .on("close", () => {
    console.log("Redis connection closed.");
  });

module.exports = {
  set: async (id, value) =>
    await Redis.set(id.toString(), JSON.stringify(value)),
  get: async (id) => JSON.parse(await Redis.get(id.toString())),
  drop: async (id) => await Redis.del(id.toString()),
};
