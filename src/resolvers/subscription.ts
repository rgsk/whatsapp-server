import { withFilter } from "graphql-subscriptions";
import { pubsub } from "./../helpers/initRedis";

export const Subscription = {
  message: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("MessageRecieved"),
      (data: any, params: any) => {
        return data.message.to === params.to;
      }
    ),
  },
};
