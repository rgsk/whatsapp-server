require("dotenv").config();
import redisClient from "./helpers/initRedis";
import { ApolloServer } from "apollo-server";

import mongoose from "mongoose";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const PORT = process.env.PORT || 8000;
redisClient.SET("name", "Rahul");
const server = new ApolloServer({
  cors: { origin: "*" },
  resolvers,
  typeDefs,
  formatError: (err) => {
    console.error("Error!!");
    console.error(err.message);
    if ((err.extensions as any).custom) {
      return err;
    }
    return new Error("Internal Server Error");
  },
});
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(console.error);
server.listen(PORT).then(() => {
  console.log(`server listening on http://localhost:${PORT}`);
});
