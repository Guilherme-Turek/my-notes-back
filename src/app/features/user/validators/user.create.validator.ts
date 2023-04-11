import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../repository/user.repository";

export class UserValidatorCreate {
  public static validateCreate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password, confirmPassword } = req.body;
      const repository = new UserRepository();
      const userExist = repository.verifyUserExist(username);
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
      if (userExist == null) {
        return RequestError.invalidData(res, "User already exists");
      }
      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
