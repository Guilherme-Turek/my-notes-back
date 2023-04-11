import { Response } from "express";

export class SucessResponse {
  public static ok(res: Response, message: string, data?: any) {
    return res.status(200).send({
      ok: true,
      msg: message,
      data,
    });
  }
  public static created(res: Response, msg: string, data: any) {
    return res.status(201).send({
      ok: true,
      msg,
      data,
    });
  }
}
