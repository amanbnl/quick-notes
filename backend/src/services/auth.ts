import { ILoginCredentails } from "../interfaces/auth"
import { CustomError } from "../interfaces/customError"
import { HTTP_STATUS } from "../lib/constants"
import { encryptPassword, generateSessionToken, handleError } from "../lib/utils"
import { User } from "../schema/users"
import bcrypt from 'bcrypt'

const login = async (reqBody: ILoginCredentails) => {
  try {
    const {
      email,
      password
    } = reqBody

    const userExistence = await User.findOne({
      email
    })
    if (!userExistence) {
      throw new CustomError({ message: "User not Found", status: HTTP_STATUS.NOT_FOUND })
    }

    const isMatch = await bcrypt.compare(password, userExistence.password);

    if (!isMatch) {
      throw new CustomError({ 
        message: "Wrong credentials", 
        status: HTTP_STATUS.BAD_REQUEST, 
        extraMessage: "Please check your credentials and try again" 
      });
    }
    const token = generateSessionToken(userExistence._id.toHexString())
    return { id: userExistence._id.toHexString(), token }
  } catch (error) {
    return handleError(error)
  }
}




export const authService = {
  login
}