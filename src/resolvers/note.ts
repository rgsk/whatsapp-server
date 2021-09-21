import { NotFoundError } from "../helpers/errors";
import { pubsub } from "../helpers/initRedis";
import NoteModel from "../models/note";

export const NoteQuery = {
  getNotes: async (parent: any, args: any, context: any, query: any) => {
    // console.log(context);
    const notes = await NoteModel.find();
    pubsub.publish("MessageRecieved", {
      message: { message: "hello brooooooooooooo", roomId: "123abc" },
    });
    notes.sort((a: any, b: any) =>
      new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
    );
    return notes;
  },
};
export const NoteMutation = {
  createNote: async (parent: any, args: any, context: any, query: any) => {
    const notes = await NoteModel.find({ uuid: args.data.uuid });
    let note: any;
    if (notes.length != 0) {
      // note with given uuid is existing
      note = notes[0];
      note.text = args.data.text;
    } else {
      note = new NoteModel(args.data);
    }
    await note.save();
    return note;
  },
  updateNote: async (parent: any, args: any, context: any, query: any) => {
    const notes = await NoteModel.find({ uuid: args.uuid });
    if (notes.length !== 0) {
      const note: any = notes[0];
      note.text = args.text;
      note.save();
      return note;
    } else {
      throw new NotFoundError("note with given id not found");
    }
  },
  deleteNote: async (parent: any, args: any, context: any, query: any) => {
    const notes = await NoteModel.find({ uuid: args.uuid });
    if (notes.length !== 0) {
      const note: any = notes[0];
      await note.delete();
      return {
        message: "deleted successfully",
      };
    } else {
      throw new NotFoundError("note with given id not found");
    }
  },
};
export const Note = {};
