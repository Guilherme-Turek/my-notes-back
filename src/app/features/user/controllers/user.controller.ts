import { Request, Response } from "express";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ServerError } from "../../../shared/errors/server.error";

export class UserController {
  public async create(req: Request, res: Response) {
    try {
      const { username, password, confirmPassword } = req.body;

      const result = await new CreateUserUsecase().execute(req.body);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
