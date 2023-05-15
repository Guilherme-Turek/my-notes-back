import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { CreateUserUsecase } from "../usecases/create-user.usecase";

export class UserController {
  public async create(req: Request, res: Response) {
    try {
      const { username, password, confirmPassword } = req.body;

      const usecase = new CreateUserUsecase();

      const result = await usecase.execute(req.body);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
