import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/common";
import { handleErrorResponse, handleSuccessResponse } from "../lib/utils";
import { noteBookService } from "../services/noteBooks";
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants";

export const getNoteBookList = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user
    const workSpaceId = req.query.workSpaceId as string
    const noteBookList = await noteBookService.getNoteBookList(user.sub, workSpaceId)
    return handleSuccessResponse({ res, data: noteBookList, message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const createNoteBook = async (req: Request, res: Response) => {
  try {
    const createdId = await noteBookService.createNoteBook({ ...req.body, userId: (req as AuthenticatedRequest).user.sub })
    return handleSuccessResponse({
      res, data: [{
        id: createdId
      }], message: HTTP_STATUS_MESSAGES.CREATED, status: HTTP_STATUS.CREATED
    })

  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const updateNoteBook = async (req: Request, res: Response) => {
  try {
    const noteBookId = req.params.id
    const updatedId = await noteBookService.updateNoteBookDetails(noteBookId as string, req.body)
    return handleSuccessResponse({ res, data: [{ id: updatedId }], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const deleteNoteBook = async (req: Request, res: Response) => {
  try {
    await noteBookService.deleteNoteBook(req.params.id as string)
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const getNoteBookDetails = async (req: Request, res: Response) => {
  try {
    const noteBookDetails = await noteBookService.getNoteBookDetails(req.params.id as string)
    return handleSuccessResponse({ res, data: [noteBookDetails], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}
