import { model, Schema } from "mongoose";
const profileSchema = new Schema(
  {
    status: String,
    profilePhotoUrl: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const ProfileModel = model("Profile", profileSchema);
export default ProfileModel;
