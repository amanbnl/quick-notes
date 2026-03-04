import { Request, Response } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../lib/utils";
import { noteService } from "../services/notes";
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants";
import { CustomError } from "../interfaces/customError";
import { AuthenticatedRequest } from "../interfaces/common";

export const createNote = async (req: Request, res: Response) => {
  try {
    const createdId = await noteService.createNote({...req.body, userId: (req as AuthenticatedRequest).user.sub})
    return handleSuccessResponse({ res, data: [{ id: createdId }], status: HTTP_STATUS.CREATED, message: HTTP_STATUS_MESSAGES.CREATED })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const getNoteDetails = async (req: Request, res: Response) => {
  try {
    const details = await noteService.getNoteDetails(req.params.id as string)
    if (!details) {
      throw new CustomError({ message: HTTP_STATUS_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    return handleSuccessResponse({ res, data: [details], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const updateNoteDetails = async (req: Request, res: Response) => {
  try {
    const updatedId = await noteService.updateNote({ ...req.body, id: req.params.id as string })
    return handleSuccessResponse({ res, data: [{ id: updatedId }], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const deleteNote = async (req: Request, res: Response) => {
  try {
    await noteService.deleteNote(req.params.id as string)
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}