import { CustomError } from "../interfaces/customError"
import { ICreateNoteBook, IShareNoteBook, IUpdateNoteBook } from "../interfaces/noteBooks"
import { HTTP_STATUS } from "../lib/constants"
import { handleError } from "../lib/utils"
import { NoteBook } from "../schema/noteBooks"
import { Types } from 'mongoose'
import { userService } from "./users"
import { Note } from "../schema/notes"
import { User } from "../schema/users"
import { WorkSpace } from "../schema/workspace"

const getNoteBookDetails = async (id: string) => {
  try {
    const notebook = await NoteBook.findOne({ _id: new Types.ObjectId(id) })
      .populate({
        path: 'notes',
        model: Note,
        select: 'title jsonBody'
      })
      .lean();
    return notebook;
  } catch (error) {
    return handleError(error);
  }
}

const getNoteBookList = async (userId: string, workSpaceId?: string) => {
  try {
    let query: any = {};
    if (workSpaceId) {
      query = { workSpaceId: new Types.ObjectId(workSpaceId) };
    } else {
      query = {
        workSpaceId: null,
        $or: [
          { createdBy: new Types.ObjectId(userId) },
          { sharedWith: new Types.ObjectId(userId) }
        ]
      };
    }

    const noteBookList = await NoteBook.find(query)
      .populate([
        {
          path: 'createdBy',
          model: User,
          select: '_id fullName createdAt'
        },
        {
          path: 'sharedWith',
          model: User,
          select: '_id fullName'
        },
        {
          path: 'workSpaceId',
          model: WorkSpace,
          select: '_id name'
        }
      ])
      .sort({ updatedAt: -1 })
      .lean();

    return noteBookList;
  } catch (error) {
    return handleError(error);
  }
}

const createNoteBook = async (reqBody: ICreateNoteBook): Promise<string> => {
  try {
    const {
      name,
      userId
    } = reqBody
    const userExistence = await userService.getUserDetails(userId)
    if (!userExistence) {
      throw new CustomError({ message: "User not Found", status: HTTP_STATUS.NOT_FOUND })
    }
    const noteBook = {
      createdBy: userExistence._id,
      name,
      ...(reqBody.workSpaceId && { workSpaceId: reqBody.workSpaceId })
    }
    const createdNoteBook = await NoteBook.create(noteBook)
    const noteBookId = createdNoteBook._id.toHexString()
    return noteBookId
  } catch (error) {
    return handleError(error)
  }
}

const updateNoteBookDetails = async (id: string, reqBody: IUpdateNoteBook): Promise<string> => {
  try {
    const {
      name
    } = reqBody
    // checking existing user TODO - use the current logged in user information 
    // const existingUser = await User.findOne({_id: new Types.ObjectId(id)})
    // if (!existingUser) {
    //   throw new CustomError({ message: HTTP_STATUS_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    // }
    const existingNoteBook = await NoteBook.findOne({ _id: new Types.ObjectId(id) })
    if (!existingNoteBook) {
      throw new CustomError({ message: "NoteBook not Found", status: HTTP_STATUS.NOT_FOUND })
    }

    existingNoteBook.name = name
    existingNoteBook.updatedAt = new Date()

    await NoteBook.updateOne({ _id: new Types.ObjectId(id) }, existingNoteBook)

    return id
  } catch (error) {
    return handleError(error)
  }
}

const deleteNoteBook = async (id: string): Promise<void> => {
  try {
    const objectId = new Types.ObjectId(id);

    const noteBookDetails = await NoteBook.findById(objectId);

    await Promise.all([
      NoteBook.deleteOne({ _id: objectId }),
      Note.deleteMany({ _id: { $in: noteBookDetails?.notes } })
    ]);

    return;
  } catch (error) {
    return handleError(error);
  }
};

const shareNoteBook = async (reqBody: IShareNoteBook): Promise<void> => {
  try {
    const {
      userId,
      id
    } = reqBody
    const existingNoteBook = await NoteBook.findOne({ _id: new Types.ObjectId(id) })
    if (!existingNoteBook) {
      throw new CustomError({ message: "NoteBook not Found", status: HTTP_STATUS.NOT_FOUND })
    }
    const sharedIds = [
      ...existingNoteBook.sharedWith,
      ...userId.map(id => new Types.ObjectId(id))
    ]
    existingNoteBook.sharedWith = sharedIds
    await NoteBook.updateOne({ _id: new Types.ObjectId(id) }, existingNoteBook)
  } catch (error) {
    return handleError(error)
  }
}

export const noteBookService = {
  getNoteBookDetails,
  createNoteBook,
  updateNoteBookDetails,
  deleteNoteBook,
  shareNoteBook,
  getNoteBookList
}