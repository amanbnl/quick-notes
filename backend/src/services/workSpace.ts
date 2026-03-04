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
import { ICreateWorkSpace, IShareWorkSpace, IUpdateWorkSpace } from "../interfaces/workSpace"

const getWorkSpaceDetails = async (id: string) => {
  try {
    return await WorkSpace.findOne({ _id: new Types.ObjectId(id) }).populate([{
      path: 'ownerId',
      model: User,
      select: '_id fullName'
    },
    {
      path: 'users',
      model: User,
      select: '_id fullName email'
    }]).lean()

  } catch (error) {
    return handleError(error)
  }
}

const getWorkSpaceList = async (userId: string) => {
  try {
    const query = {
      $or: [
        { ownerId: new Types.ObjectId(userId) },
        { users: new Types.ObjectId(userId) }
      ]
    };

    const workSpaceList = await WorkSpace.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    return workSpaceList;
  } catch (error) {
    return handleError(error);
  }
}

const createWorkSpace = async (reqBody: ICreateWorkSpace): Promise<string> => {
  try {
    const {
      name,
      userId
    } = reqBody
    const userExistence = await userService.getUserDetails(userId)
    if (!userExistence) {
      throw new CustomError({ message: "User not Found", status: HTTP_STATUS.NOT_FOUND })
    }

    const workSpace = {
      ownerId: userExistence._id,
      name
    }
    const createdWorkSpace = await WorkSpace.create(workSpace)
    const workSpaceId = createdWorkSpace._id.toHexString()
    return workSpaceId
  } catch (error) {
    return handleError(error)
  }
}

const updateWorkSpaceDetails = async (id: string, reqBody: IUpdateWorkSpace): Promise<string> => {
  try {
    const {
      name
    } = reqBody
    const existingWorkSpace = await WorkSpace.findOne({ _id: new Types.ObjectId(id) })
    if (!existingWorkSpace) {
      throw new CustomError({ message: "WorkSpace not Found", status: HTTP_STATUS.NOT_FOUND })
    }

    existingWorkSpace.name = name
    existingWorkSpace.updatedAt = new Date()

    await WorkSpace.updateOne({ _id: new Types.ObjectId(id) }, existingWorkSpace)

    return id
  } catch (error) {
    return handleError(error)
  }
}

const deleteWorkSpace = async (id: string): Promise<void> => {
  try {
    const objectId = new Types.ObjectId(id);

    await WorkSpace.findById(objectId);

    await Promise.all([
      WorkSpace.deleteOne({ _id: objectId })
    ]);

    return;
  } catch (error) {
    return handleError(error);
  }
};

const shareWorkSpace = async (reqBody: IShareWorkSpace): Promise<void> => {
  try {
    const { workSpaceId, userIds } = reqBody;
    const userObjectIds = userIds.map(id => new Types.ObjectId(id));

    const result = await WorkSpace.updateOne(
      { _id: new Types.ObjectId(workSpaceId) },
      [
        {
          $set: {
            users: { $setUnion: ["$users", userObjectIds] },
            memberCount: {
              $add: [
                "$memberCount",
                { $size: { $setDifference: [userObjectIds, "$users"] } }
              ]
            }
          }
        }
      ]
    );
  } catch (error) {
    return handleError(error);
  }
}

const revokeWorkSpaceAccess = async (reqBody: IShareWorkSpace): Promise<void> => {
  try {
    const { workSpaceId, userIds } = reqBody;
    const userObjectIds = userIds.map(id => new Types.ObjectId(id));

    const result = await WorkSpace.updateOne(
      { _id: new Types.ObjectId(workSpaceId) },
      [
        {
          $set: {
            users: { $setDifference: ["$users", userObjectIds] },
            memberCount: {
              $subtract: [
                "$memberCount",
                {
                  $size: {
                    $setIntersection: ["$users", userObjectIds]
                  }
                }
              ]
            }
          }
        }
      ]
    );
  } catch (error) {
    return handleError(error);
  }
}



export const workSpaceService = {
  getWorkSpaceDetails,
  getWorkSpaceList,
  createWorkSpace,
  updateWorkSpaceDetails,
  deleteWorkSpace,
  revokeWorkSpaceAccess,
  shareWorkSpace
}