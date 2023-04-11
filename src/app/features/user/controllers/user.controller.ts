import { Request, Response } from "express";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { SucessResponse } from "../../../shared/utils/success.response";
import { ServerError } from "../../../shared/errors/server.error";

export class UserController {
  public async create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await new CreateUserUsecase().execute(req.body);

      return SucessResponse.created(
        res,
        "User was successfully create",
        result.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
