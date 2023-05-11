import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";

export class NotesValidator {
  public static MandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return RequestError.fieldNotProvided(res, "Title");
      }
      if (!description) {
        return RequestError.fieldNotProvided(res, "Description");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
