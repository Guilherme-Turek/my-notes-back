import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../../user/repository/user.repository";

export class LoginValidator {
  public static MandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = req.body;
      if (!username) {
        return RequestError.fieldNotProvided(res, "Username");
      }
      if (!password) {
        return RequestError.fieldNotProvided(res, "Password");
      }
      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
