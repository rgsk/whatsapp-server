import { model, Schema } from "mongoose";
const MessageSchema = new Schema(
  {
    to: String,
    from: String,
    text: String,
  },

  {
    timestamps: true,
  }
);
const MessageModel = model("Message", MessageSchema);
export default MessageModel;
