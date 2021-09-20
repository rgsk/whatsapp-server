require("dotenv").config();
import redisClient from "./helpers/initRedis";

import { ApolloServer } from "apollo-server-express";
import express from "express";

import cors from "cors";
import mongoose from "mongoose";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { loggerDirective, upperCaseDirective } from "./resolvers/directives";
let schema = makeExecutableSchema({ typeDefs, resolvers });

schema = loggerDirective(schema, "logger");
schema = upperCaseDirective(schema, "upperCase");
const PORT = process.env.PORT || 8000;
redisClient.set("name", "Mehak");

const app = express();
app.use(cors());
app.get("/", (_req, res) => {
  res.send("<h1>Connected visit please visit please /graphql</h1>");
});
const apolloServer = new ApolloServer({
  schema,
  formatError: (err) => {
    console.error("Error!!");
    console.error(err.message);
    if ((err.extensions as any).custom) {
      return err;
    }
    return new Error("Internal Server Error");
  },
});
(async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
})();
const server = app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}/graphql`);
});
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(console.error);
