import { CustomError } from "../interfaces/customError"
import { ICreateUser, IforgotPassword, IResetPassword, IUpdateUser } from "../interfaces/users"
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants"
import { sendForgotPasswordEmail, sendWelcomeEmail } from "../lib/mailer"
import { encryptPassword, generateActivationLink, generateForgotPasswordLink, handleError } from "../lib/utils"
import { User } from "../schema/users"
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const getUserDetails = async (id: string) => {
  try {
    return await User.findOne({ _id: new Types.ObjectId(id) }).select("-password")
  } catch (error) {
    return handleError(error)
  }
}

const createUser = async (reqBody: ICreateUser): Promise<string> => {
  try {
    const {
      email,
      password,
      fullName
    } = reqBody
    const hashPassword = await encryptPassword(password)
    const user = {
      email,
      fullName: fullName || "",
      password: hashPassword
    }
    const createdUser = await User.create(user)
    const userId = createdUser._id.toHexString()
    const activationLink = generateActivationLink(userId)
    await sendWelcomeEmail(email, fullName || "Buddy", activationLink)
    return userId
  } catch (error) {
    return handleError(error)
  }
}

const updateUserDetails = async (id: string, reqBody: IUpdateUser): Promise<string> => {
  try {
    const {
      fullName,
      age
    } = reqBody
    // checking existing user
    const existingUser = await User.findOne({ _id: new Types.ObjectId(id) })
    if (!existingUser) {
      throw new CustomError({ message: HTTP_STATUS_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    // updating details
    existingUser.fullName = fullName,
      existingUser.age = age
    existingUser.updatedAt = new Date()

    await User.updateOne({ _id: new Types.ObjectId(id) }, existingUser)

    return id
  } catch (error) {
    return handleError(error)
  }
}

const deleteUserDetails = async (id: string): Promise<void> => {
  try {
    await User.deleteOne({ _id: new Types.ObjectId(id) })
    // NEED TO DO CLEANUP HERE
    return
  } catch (error) {
    return handleError(error)
  }
}

const verifyUserAccount = async (token: string): Promise<void> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET!) as { sub: string };
    const existingUser = await User.findOne({
      _id: new Types.ObjectId(decoded.sub),
      isActive: false
    })
    if (!existingUser) {
      throw new CustomError({ message: "User is Already Active", status: HTTP_STATUS.OK })
    }
    await User.updateOne({
      _id: new Types.ObjectId(decoded.sub)
    }, {
      isActive: true
    })
  } catch (error) {
    return handleError(error)
  }
}

const searchUser = async (email: string) => {
  try {
    const usersList = await User.find({
      $or: [
        { email: { $regex: email, $options: 'i' } },
        { fullName: { $regex: email, $options: 'i' } }
      ]
    }).select('email fullName')
      .lean();
    return usersList.map((u) => ({ ...u, _id: u._id.toHexString() }))
  } catch (error) {
    return handleError(error)
  }
}


const resetPassword = async (reqBody: IResetPassword) => {
  try {
    const { oldPassword, newPassword, userId } = reqBody
    const existingUser = await User.findOne({ _id: new Types.ObjectId(userId) })
    if (!existingUser) {
      throw new CustomError({ message: "User not found", status: HTTP_STATUS.NOT_FOUND })
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, existingUser.password);

    if (!isPasswordMatch) {
      throw new CustomError({
        message: "Password not matched",
        status: HTTP_STATUS.BAD_REQUEST
      });
    }
    const hashPassword = await encryptPassword(newPassword)
    existingUser.password = hashPassword
    await User.updateOne({ _id: existingUser._id }, existingUser)
    return existingUser._id.toHexString()
  } catch (error) {
    return handleError(error)
  }
}

const forgotPassword = async (reqBody: IforgotPassword) => {
  try {
    if (reqBody.email) {
      const { email } = reqBody
      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        throw new CustomError({ message: "User not found", status: HTTP_STATUS.NOT_FOUND })
      }

      const activationLink = generateForgotPasswordLink(existingUser._id.toHexString())
      await sendForgotPasswordEmail(email, existingUser.fullName as string, activationLink)
      return
    } else if (reqBody.newPassword && reqBody.confirmPassword && reqBody.userId) {
      
      const { newPassword, confirmPassword, userId } = reqBody
      const hashPassword = await encryptPassword(newPassword)
      const existingUser = await User.findOne({ _id: new Types.ObjectId(userId) })
      if (!existingUser) {
        throw new CustomError({ message: "User not found", status: HTTP_STATUS.NOT_FOUND })
      }
      existingUser.password = hashPassword
      await User.updateOne({ _id: existingUser._id }, existingUser)
    }
  } catch (error) {
    return handleError(error)
  }
}

export const userService = {
  createUser,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
  verifyUserAccount,
  searchUser,
  resetPassword,
  forgotPassword
}