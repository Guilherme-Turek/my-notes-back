import { Request, Response } from "express";
import { LoginUsecase } from "../usecases/login.usecase";
import { ServerError } from "../../../shared/errors/server.error";

export class LoginController {
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await new LoginUsecase().execute(req.body);

      return res.status(result.code).send(result.data);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
