import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { CreateNoteusecase } from "../usecases/create-note.usecase";
import { UserRepository } from "../../user/repository/user.repository";
import { ListNotesUsecase } from "../usecases/list-notes.usecase";

export class NoteController {
  public async create(req: Request, res: Response) {
    try {
      const { idUser } = req.params;
      const { title, description } = req.body;

      const userRepository = new UserRepository();
      const user = userRepository.get(idUser);

      if (!user) {
        return {
          ok: false,
          code: 404,
          message: "Usuário não encontrado",
        };
      }

      const usecase = new CreateNoteusecase();
      const result = await usecase.execute({
        title,
        description,
        idUser,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(error, res);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await new ListNotesUsecase().execute(id);

      return res.status(result.code).send(result.data);
    } catch (error: any) {
      return ServerError.genericError(error, res);
    }
  }
}
