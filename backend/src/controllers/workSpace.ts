import { Request, Response } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../lib/utils";
import { workSpaceService } from "../services/workSpace";
import { AuthenticatedRequest } from "../interfaces/common";
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants";

export const getWorkSpaceList = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.sub
    const workSpaceList = await workSpaceService.getWorkSpaceList(userId)
    return handleSuccessResponse({ res, data: workSpaceList, message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const getWorkSpaceDetails = async (req: Request, res: Response) => {
  try {
    const workSpaceId = req.params.id as string
    const workSpaceDetails = await workSpaceService.getWorkSpaceDetails(workSpaceId)
    return handleSuccessResponse({ res, data: [workSpaceDetails], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const createWorkSpace = async (req: Request, res: Response) => {
  try {
    const createdId = await workSpaceService.createWorkSpace({...req.body, userId: (req as AuthenticatedRequest).user.sub})
    return handleSuccessResponse({ res, status: HTTP_STATUS.CREATED, data: [{ id: createdId }], message: HTTP_STATUS_MESSAGES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const updateWorkSpace = async (req: Request, res: Response) => {
  try {
    const updatedId = await workSpaceService.updateWorkSpaceDetails(req.params.id as string, req.body)
    return handleSuccessResponse({ res, data: [{ id: updatedId }], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const inviteUserToWorkSpace = async (req: Request, res: Response) => {
  try {
    await workSpaceService.shareWorkSpace(req.body)
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const revokeUserAccess = async (req: Request, res: Response) => {
  try {
    await workSpaceService.revokeWorkSpaceAccess(req.body)
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const deleteWorkSpace = async (req: Request, res: Response) => {
  try {
    await workSpaceService.deleteWorkSpace(req.params.id as string)
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}