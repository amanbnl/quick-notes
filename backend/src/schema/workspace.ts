import { Schema, model } from 'mongoose';
import { USER_SCHEMA_NAME, WORKSPACE_SCHEMA_NAME } from '../lib/constants';

const workSpaceSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER_SCHEMA_NAME
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: USER_SCHEMA_NAME
      }
    ],
    memberCount: {
      type: Number,
      required: false,
      default: 1
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const WorkSpace = model(WORKSPACE_SCHEMA_NAME, workSpaceSchema);