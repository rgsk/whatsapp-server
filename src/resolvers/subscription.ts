import { withFilter } from "graphql-subscriptions";
import { pubsub } from "./../helpers/initRedis";

export const Subscription = {
  message: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("MessageRecieved"),
      (data: any, params: any) => {
        // console.log({ data, params }, data.message.roomId === params.roomId);
        return data.message.roomId === params.roomId;
      }
    ),
  },
};
//
