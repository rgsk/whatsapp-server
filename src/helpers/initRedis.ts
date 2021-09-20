import Redis from "ioredis";
console.log("redis initializing");
const redisClient = new Redis({
  host: process.env.REDIS_HOSTNAME,
  port: +process.env.REDIS_PORT!,
  password: process.env.REDIS_PASSWORD,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  db: 0,
});

redisClient.on("connect", () => {
  console.log("Client connected to redis...");
  redisClient.set("my-goal", "skartner");
});
export default redisClient;
