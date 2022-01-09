import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: String,
    phone: String,
  },

  {
    timestamps: true,
  }
);
const UserModel = model("User", userSchema);
export default UserModel;
