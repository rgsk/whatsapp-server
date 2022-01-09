import { NotFoundError } from "../helpers/errors";
import { pubsub } from "../helpers/initRedis";
import { getProjection } from "../helpers/utils";
import MessageModel from "../models/message";

export const MessageQuery = {
  getMessages: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    const messages = await MessageModel.find({}, projection);
    return messages;
  },
  getMessagesForUser: async (
    parent: any,
    args: any,
    context: any,
    query: any
  ) => {
    console.log(args.phone);
    const projection = getProjection(query);
    const sentMessages = await MessageModel.find(
      {
        from: args.phone,
      },
      projection
    );
    const receivedMessages = await MessageModel.find(
      {
        to: args.phone,
      },
      projection
    );
    return [...sentMessages, ...receivedMessages];
  },
};
//
export const MessageMutation = {
  createMessage: async (parent: any, args: any, context: any, query: any) => {
    const message = {
      text: args.text,
      to: args.to,
      from: args.from,
    };
    const newMessage = new MessageModel(message);
    await newMessage.save();
    pubsub.publish("MessageRecieved", {
      message,
    });

    return {
      message: "sent",
    };
  },
};
export const Message = {};
