import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { handleErrorResponse } from "../lib/utils";
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants";
import { CustomError } from "../interfaces/customError";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError({ 
        message: HTTP_STATUS_MESSAGES.UNAUTHORIZED, 
        status: HTTP_STATUS.UNAUTHORIZED 
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SESSION_KEY as string;

    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    // 3. Differentiate JWT-specific errors within the main catch
    if (error instanceof TokenExpiredError) {
      return handleErrorResponse(res, new CustomError({
        message: "Your session has expired. Please log in again.",
        status: HTTP_STATUS.UNAUTHORIZED
      }));
    }

    if (error instanceof JsonWebTokenError) {
      return handleErrorResponse(res, new CustomError({
        message: "Your session has expired. Please log in again.",
        status: HTTP_STATUS.UNAUTHORIZED
      }));
    }
    return handleErrorResponse(res, error);
  }
};

export const forgotPasswordGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError({ 
        message: HTTP_STATUS_MESSAGES.UNAUTHORIZED, 
        status: HTTP_STATUS.UNAUTHORIZED 
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_ACTIVATION_SECRET as string;

    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    // 3. Differentiate JWT-specific errors within the main catch
    if (error instanceof TokenExpiredError) {
      return handleErrorResponse(res, new CustomError({
        message: "Link is Expired please try again later.",
        status: HTTP_STATUS.UNAUTHORIZED
      }));
    }

    if (error instanceof JsonWebTokenError) {
      return handleErrorResponse(res, new CustomError({
        message: "Link is Expired please try again later.",
        status: HTTP_STATUS.UNAUTHORIZED
      }));
    }
    return handleErrorResponse(res, error);
  }
};