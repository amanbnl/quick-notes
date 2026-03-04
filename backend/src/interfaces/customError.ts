import { Response } from "express";

interface ICustomError {
  message: string
  status?: number
  data?: unknown
  extraMessage?: unknown
}

export class CustomError implements ICustomError {
  public message: string;
  public status: number;
  public extraMessage: unknown
  constructor({ message, status, extraMessage}: ICustomError) {
    this.message = message;
    this.status = status as number;
    this.extraMessage = extraMessage
  }
}

export interface GlobalResponse extends ICustomError {
  res: Response
  data?: any
  error?: any
}