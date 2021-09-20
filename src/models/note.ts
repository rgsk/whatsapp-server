import { model, Schema } from "mongoose";
const noteSchema = new Schema(
  {
    uuid: {
      type: String,
      unique: true,
      required: true,
    },
    text: String,
  },

  {
    timestamps: true,
  }
);
const NoteModel = model("Note", noteSchema);
export default NoteModel;
