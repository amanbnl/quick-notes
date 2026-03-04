import { Schema, model } from 'mongoose';
import { NOTE_BOOK_SCHEMA_NAME, NOTES_SCHEMA_NAME, USER_SCHEMA_NAME, WORKSPACE_SCHEMA_NAME } from '../lib/constants';

const noteBookSchema = new Schema(
  {
    createdBy: {
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
    sharedWith: [{
      type: Schema.Types.ObjectId,
      ref: USER_SCHEMA_NAME
    }],
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: NOTES_SCHEMA_NAME
      }
    ],
    workSpaceId: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: WORKSPACE_SCHEMA_NAME
    },
    notesCount: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const NoteBook = model(NOTE_BOOK_SCHEMA_NAME, noteBookSchema);