import { NotFoundError } from "../helpers/errors";
import { getProjection } from "../helpers/utils";
import UserModel from "../models/user";
import ProfileModel from "../models/profile";
export const ProfileQuery = {
  getProfile: async (parent: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    const profile = await ProfileModel.findById(args._id, projection);
    if (!profile) {
      throw new NotFoundError("profile with given id not found");
    }
    return profile;
  },
  getProfileForUser: async (
    parent: any,
    args: any,
    context: any,
    query: any
  ) => {
    const projection = getProjection(query);
    const profiles = await ProfileModel.find(
      { userId: args.userId },
      projection
    );

    if (profiles.length == 0) {
      throw new NotFoundError("profile with given userId not found");
    }
    return profiles[0];
  },
};
export const ProfileMutation = {
  createProfile: async (parent: any, args: any, context: any, query: any) => {
    // console.log(args.data)
    const profile = new ProfileModel(args.data);
    await profile.save();
    return profile;
  },
  updateProfile: async (parent: any, args: any, context: any, query: any) => {
    let profile: any;
    if (args._id) {
      profile = await ProfileModel.findById(args._id);
    } else if (args.userId) {
      const profiles = await ProfileModel.find({ userId: args.userId });
      profile = profiles[0];
    }
    if (profile) {
      for (let field in args.data) {
        profile[field] = args.data[field];
      }
      await profile.save();
      return profile;
    } else {
      throw new NotFoundError("profile with given id not found");
    }
  },
  deleteProfile: async (parent: any, args: any, context: any, query: any) => {
    let profile: any;
    if (args._id) {
      profile = await ProfileModel.findById(args._id);
    } else if (args.userId) {
      const profiles = await ProfileModel.find({ userId: args.userId });
      profile = profiles[0];
    }
    if (profile) {
      await profile.delete();
      return {
        message: "deleted successfully",
      };
    } else {
      throw new NotFoundError("profile with given id not found");
    }
  },
};
export const Profile = {
  user: async (profile: any, args: any, context: any, query: any) => {
    const projection = getProjection(query);
    // console.log(projection);
    const user = await UserModel.findById(profile.userId, projection);
    // console.log(user);
    return user;
  },
};
//
