import { Request, Response } from "express";
import { LoginUsecase } from "../usecases/login.usecase";
import { ServerError } from "../../../shared/errors/server.error";
import { RequestError } from "../../../shared/errors/request.error";
import { SucessResponse } from "../../../shared/utils/success.response";

export class LoginController {
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await new LoginUsecase().execute(req.body);

      return SucessResponse.ok(res, "User logged", result.data);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
