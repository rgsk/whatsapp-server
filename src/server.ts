import { SubscriptionServer } from "subscriptions-transport-ws";
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
import { execute, subscribe } from "graphql";
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
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
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

const subscriptionServer = SubscriptionServer.create(
  {
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
  },
  {
    // This is the `httpServer` we created in a previous step.
    server: server,
    // This `server` is the instance returned from `new ApolloServer`.
    path: apolloServer.graphqlPath,
  }
);
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(console.error);
