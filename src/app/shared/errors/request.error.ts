import { Response } from "express";

export class RequestError {
  public static fieldNotProvided(res: Response, field: string) {
    return res.status(400).send({
      ok: false,
      message: field + " was not provided!",
    });
  }
  // public static notFound(res: Response, message: string) {
  //   return res.status(404).send({
  //     ok: false,
  //     message,
  //   });
  // }
  public static invalidData(res: Response, message: string) {
    return res.status(401).send({
      ok: false,
      message,
    });
  }
}
