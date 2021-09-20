import { pubsub } from "./index";
import { PubSub, withFilter } from "graphql-subscriptions";

export const Subscription = {
  message: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("MessageRecieved"),
      () => {
        return true;
      }
    ),
  },
};
