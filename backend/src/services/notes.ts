import { Types } from "mongoose"
import { CustomError } from "../interfaces/customError"
import { createNote as ICreateNote, updateNote as IUpdateNote } from "../interfaces/notes"
import { HTTP_STATUS } from "../lib/constants"
import { handleError } from "../lib/utils"
import { Note } from "../schema/notes"
import { User } from "../schema/users"
import { NoteBook } from "../schema/noteBooks"

const createNote = async (reqBody: ICreateNote): Promise<string> => {
  try {
    const { title, jsonBody, userId, notebookId } = reqBody;

    const userExistence = await User.findById(userId).select('_id');
    if (!userExistence) {
      throw new CustomError({
        message: "User not found",
        status: HTTP_STATUS.NOT_FOUND
      });
    }

    const createdNote = await Note.create({
      title,
      jsonBody,
      userId: userExistence._id
    });

    await NoteBook.findOneAndUpdate(
      { _id: notebookId },
      {
        $push: { notes: createdNote._id },
        $inc: { notesCount: 1 }
      }
    );

    return createdNote._id.toHexString();
  } catch (error) {
    return handleError(error);
  }
}

const getNoteDetails = async (id: string) => {
  try {
    const details = await Note.findOne({ _id: new Types.ObjectId(id) })
    return details
  } catch (error) {
    return handleError(error)
  }
}

const updateNote = async (reqBody: IUpdateNote): Promise<string> => {
  try {
    const noteExistence = await Note.findOne({ _id: new Types.ObjectId(reqBody.id) })
    if (!noteExistence) {
      throw new CustomError({
        message: 'Note not Found',
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    noteExistence.title = reqBody.title
    noteExistence.jsonBody = reqBody.jsonBody
    noteExistence.updatedAt = new Date()
    await Note.updateOne({ _id: noteExistence._id }, noteExistence)
    return noteExistence._id.toHexString()
  } catch (error) {
    return handleError(error)
  }
}

const deleteNote = async (id: string): Promise<void> => {
  try {
    const noteObjectId = new Types.ObjectId(id);

    const deletionResult = await Note.deleteOne({ _id: noteObjectId });

    if (deletionResult.deletedCount === 0) {
      throw new CustomError({
        message: "Note not found",
        status: HTTP_STATUS.NOT_FOUND
      });
    }
    await NoteBook.findOneAndUpdate(
      { notes: noteObjectId },
      {
        $pull: { notes: noteObjectId },
        $inc: { notesCount: -1 }
      }
    );

  } catch (error) {
    return handleError(error);
  }
}

export const noteService = {
  createNote,
  getNoteDetails,
  updateNote,
  deleteNote
}