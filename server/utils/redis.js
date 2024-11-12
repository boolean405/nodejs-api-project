// localhost Redis
// const Redis = require("async-redis").createClient();

require("dotenv").config();

// Server Redis
const Redis = require("redis")
  .createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  })
  // .on("error", (err) => console.log("Redis Client Error", err))
  .connect()
  .then(() => {
    console.log("Success, Connected to Redis");
  })
  .catch((err) => {
    console.log("Failed to connect to Redis:", err);
  });


module.exports = {
  set: async (id, value) =>
    await Redis.set(id.toString(), JSON.stringify(value)),
  get: async (id) => JSON.parse(await Redis.get(id.toString())),
  drop: async (id) => await Redis.del(id.toString()),
};
