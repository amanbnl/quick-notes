import bcrypt from 'bcrypt';
import { Response } from 'express';
import { CustomError, GlobalResponse } from '../interfaces/customError'
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from './constants';
import jwt from 'jsonwebtoken'
// Constants (replacing private class members)
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string) || 10;



/**
 * Hash a plain password using bcrypt.
 */
export const hashPassword = async (rawPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(rawPassword, salt);
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
};

/**
 * Normalizes/Throws a standardized CustomError
 */
export const handleError = (error: unknown): never => {
  if (error instanceof CustomError) {
    throw error;
  }

  const message = error instanceof Error ? error.message : HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
  throw new CustomError({ message, status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
};

/**
 * Sends a successful JSON response
 */
export const handleSuccessResponse = (props: GlobalResponse): Response => {
  const {
    data = [],
    message = HTTP_STATUS_MESSAGES.OK,
    res,
    status = HTTP_STATUS.OK,
    error
  } = props;

  // Use the renamed variable here
  return res.status(status).json({
    message,
    status: status,
    data,
    error: error ?? null
  });
};

/**
 * Sends an error JSON response
 */
export const handleErrorResponse = (res: Response, errorDetails: CustomError | unknown): Response => {
  let message = HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
  let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (errorDetails instanceof CustomError) {
    message = errorDetails.message;
    status = errorDetails.status;
  } else {
    try {
      handleError(errorDetails);
    } catch (error) {
      const err = error as CustomError;
      message = err.message;
      status = err.status;
      errorDetails = err;
    }
  }

  return res.status(status).json({
    message,
    status,
    data: [],
    error: errorDetails
  });
};

export const generateActivationLink = (userId: string): string => {
  const token = jwt.sign(
    { sub: userId },
    process.env.JWT_ACTIVATION_SECRET!,
    { expiresIn: '24h' }
  );
  const url = process.env.ACTIVATION_REDIRECT_URL_LOCAL as string + "?token=" + token
  return url
};

export const encryptPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = parseInt(process.env.SALT_ROUND as string) || 10
  const hashPassword = await bcrypt.hash(plainPassword, saltRounds)
  return hashPassword
}

export const generateSessionToken = (userId: string): string => {
  const token = jwt.sign(
    { sub: userId },
    process.env.JWT_SESSION_KEY!,
    { expiresIn: '24h' }
  );
  return token
}

export const validateToken = (token: string): string => {
  const verifyReq = jwt.verify(token, process.env.JWT_SESSION_KEY!)
  return verifyReq.sub as string
}

export const generateForgotPasswordLink = (userId: string): string => {
  const token = jwt.sign(
    { sub: userId },
    process.env.JWT_ACTIVATION_SECRET!,
    { expiresIn: '5m' }
  );
  const url = process.env.FORGOT_PASSWORD_REDIRECT_URL_LOCAL as string + "?token=" + token
  return url
};