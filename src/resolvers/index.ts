import { User, UserQuery, UserMutation } from "./user";
import { Profile, ProfileQuery, ProfileMutation } from "./profile";
import { Note, NoteQuery, NoteMutation } from "./note";
const resolvers = {
  Query: {
    ...UserQuery,
    ...ProfileQuery,
    ...NoteQuery,
  },

  Mutation: {
    ...UserMutation,
    ...ProfileMutation,
    ...NoteMutation,
  },
  User,
  Profile,
  Note,
};

export default resolvers;
