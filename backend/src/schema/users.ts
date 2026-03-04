import { Schema, model } from 'mongoose';
import { USER_SCHEMA_NAME } from '../lib/constants';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: false,
      trim: true,
      default: null,
      index: true
    },
    age: {
      type: Number,
      required: false,
      default: null
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model(USER_SCHEMA_NAME, userSchema);