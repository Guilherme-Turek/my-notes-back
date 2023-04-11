import { NextFunction, Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { UserRepository } from "../../user/repository/user.repository";

export class LoginValidator {
  public static ValidateLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const repository = new UserRepository();
      const userExist = repository.verifyUserExist(username, password);
      if (!username) {
        return RequestError.fieldNotProvided(res, "Username");
      }
      if (!password) {
        return RequestError.fieldNotProvided(res, "Password");
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
