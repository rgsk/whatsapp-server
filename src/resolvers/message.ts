import { NotFoundError } from "../helpers/errors";
import { pubsub } from "../helpers/initRedis";

export const MessageQuery = {};
export const MessageMutation = {
  createMessage: async (parent: any, args: any, context: any, query: any) => {
    pubsub.publish("MessageRecieved", {
      message: {
        text: args.text,
        to: args.to,
        from: args.from,
      },
    });
    return {
      message: "sent",
    };
  },
};
export const Message = {};
