import { User, UserQuery, UserMutation } from "./user";
import { Profile, ProfileQuery, ProfileMutation } from "./profile";
import { Note, NoteQuery, NoteMutation } from "./note";
import { Message, MessageQuery, MessageMutation } from "./message";
import { Subscription } from "./subscription";
const resolvers = {
  Query: {
    ...UserQuery,
    ...ProfileQuery,
    ...NoteQuery,
    ...MessageQuery,
  },

  Mutation: {
    ...UserMutation,
    ...ProfileMutation,
    ...NoteMutation,
    ...MessageMutation,
  },
  Subscription,
  User,
  Profile,
  Note,
  Message,
};

export default resolvers;
