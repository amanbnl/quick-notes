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
    const result = await WorkSpace.aggregate([
      // 1. Find the specific Workspace
      { $match: { _id: new Types.ObjectId(id) } },

      // 2. "Join" the owner details
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'ownerId'
        }
      },
      { $unwind: '$ownerId' }, // Convert array to object

      // 3. "Join" the users details
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users'
        }
      },

      // 4. THE PROJECT STAGE (Filtering + Field Selection)
      {
        $project: {
          name: 1, // include workspace name
          memberCount: 1,
          ownerId: { _id: 1, fullName: 1 }, // Select specific owner fields
          users: {
            $filter: {
              input: '$users',
              as: 'u',
              // The logic: Keep user if their _id is NOT equal to ownerId
              cond: { $ne: ['$$u._id', '$ownerId._id'] }
            }
          }
        }
      },

      // 5. Final projection to clean up user fields
      {
        $project: {
          name: 1,
          memberCount: 1,
          ownerId: 1,
          "users._id": 1,
          "users.fullName": 1,
          "users.email": 1
        }
      }
    ]);

    return result[0] || null;
  } catch (error) {
    return handleError(error);
  }
};

const getWorkSpaceList = async (userId: string) => {
  try {
    console.log("user id =->", userId)
    const query = {
      $or: [
        { ownerId: new Types.ObjectId(userId) },
        { users: userId }
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
    const { name, userId } = reqBody;

    const userExistence = await userService.getUserDetails(userId);
    if (!userExistence) {
      throw new CustomError({
        message: "User not Found",
        status: HTTP_STATUS.NOT_FOUND
      });
    }

    const workSpace = {
      ownerId: userExistence._id,
      name,
      users: [userExistence._id],
      memberCount: 1
    };

    const createdWorkSpace = await WorkSpace.create(workSpace);
    return createdWorkSpace._id.toHexString();

  } catch (error) {
    return handleError(error);
  }
};

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
            users: {
              $setUnion: ["$users", userObjectIds]
            },
            memberCount: {
              $size: {
                $setUnion: ["$users", userObjectIds]
              }
            }
          }
        }
      ],
      { updatePipeline: true }
    );
  } catch (error) {
    return handleError(error);
  }
}

const revokeWorkSpaceAccess = async (reqBody: IShareWorkSpace): Promise<void> => {
  try {
    const { workSpaceId, userIds } = reqBody;
    const userObjectIds = userIds.map(id => new Types.ObjectId(id));

    await WorkSpace.collection.updateOne(
      { _id: new Types.ObjectId(workSpaceId) },
      [
        {
          $set: {
            users: { $setDifference: ["$users", userObjectIds] },
            memberCount: {
              $size: { $setDifference: ["$users", userObjectIds] }
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