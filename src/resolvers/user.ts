import { NotFoundError } from "../helpers/errors";
import { getProjection } from "../helpers/utils";
import ProfileModel from "../models/profile";
import UserModel from "../models/user";
export const UserQuery = {
  getUsers: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    const users = await UserModel.find({}, projection);
    return users;
  },
  getUser: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    // console.log(projection);
    const users = await UserModel.find({ phone: args.phone }, projection);
    const user = users[0];
    if (!user) {
      throw new NotFoundError("user with given id not found");
    }
    return user;
  },
};
export const UserMutation = {
  createUser: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    const users = await UserModel.find({ phone: args.data.phone }, projection);
    const user = users[0];
    if (user) {
      return user;
    }
    const newUser = new UserModel(args.data);
    await newUser.save();
    return newUser;
  },
};
export const User = {
  profile: async (user: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    // console.log(projection);
    const profiles = await ProfileModel.find({ userId: user._id }, projection);
    // console.log(profiles[0]);
    return profiles[0];
  },
};
//
