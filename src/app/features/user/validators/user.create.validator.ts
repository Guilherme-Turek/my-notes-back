import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";

export class UserValidatorCreate {
  public static MandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password, confirmPassword } = req.body;
      if (!username) {
        return RequestError.fieldNotProvided(res, "Username");
      }
      if (!password) {
        return RequestError.fieldNotProvided(res, "Password");
      }
      if (!confirmPassword) {
        return RequestError.fieldNotProvided(res, "Confirm password");
      }
      if (password !== confirmPassword) {
        return RequestError.invalidData(res, "Passwords do not match");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
