import { Schema, model } from 'mongoose';
import { NOTES_SCHEMA_NAME, USER_SCHEMA_NAME } from '../lib/constants';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
      default: null,
      index: true
    },
    jsonBody: {
      type: String,
      required: false,
      default: null
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_SCHEMA_NAME
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const Note = model(NOTES_SCHEMA_NAME, noteSchema);