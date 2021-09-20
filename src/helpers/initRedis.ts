import redis from "redis";
console.log("redis initializing");
const redisClient = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: +process.env.REDIS_PORT!,
  password: process.env.REDIS_PASSWORD,
});
redisClient.on("connect", () => {
  console.log("Client connected to redis...");
  redisClient.set("my-goal", "skartner");
});
export default redisClient;
