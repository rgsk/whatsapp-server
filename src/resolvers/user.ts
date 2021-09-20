import { pubsub } from "./index";
import { NotFoundError } from "../helpers/errors";
import { getProjection } from "../helpers/utils";
import ProfileModel from "../models/profile";
import UserModel from "../models/user";

export const UserQuery = {
  getUsers: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    pubsub.publish("MessageRecieved", { message: "hello brooooooooooooo" });
    const users = await UserModel.find({}, projection);
    return users;
  },
  getUser: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    console.log(projection);
    const user = await UserModel.findById(args._id, projection);
    if (!user) {
      throw new NotFoundError("user with given id not found");
    }
    return user;
  },
};
export const UserMutation = {
  createUser: async (parent: any, args: any, context: any, query: any) => {
    const user = new UserModel(args.data);
    await user.save();
    return user;
  },
};
export const User = {
  test: (user: any) => {
    return { text: "test string" };
  },
  profile: async (user: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    // console.log(projection);
    const profiles = await ProfileModel.find({ userId: user._id }, projection);
    // console.log(profiles[0]);
    return profiles[0];
  },
};
