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

// add random redis key to validate redis
redisClient.set("test", "testing..");

// register schemas
let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = loggerDirective(schema, "logger");
schema = upperCaseDirective(schema, "upperCase");

// initializing apolloServer
const apolloServer = new ApolloServer({
  schema,

  // this way req, res will be available in context
  context: ({ req, res }) => ({
    req,
    res,
  }),
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
const app = express();
app.use(cors());
app.get("/", (_req, res) => {
  res.send("<h1>Connected visit please visit please /graphql</h1>");
});
////
(async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
})();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}/graphql`);
});

const subscriptionServer = SubscriptionServer.create(
  {
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`
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
// initialize mongoose
mongoose
  .connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(console.error);
