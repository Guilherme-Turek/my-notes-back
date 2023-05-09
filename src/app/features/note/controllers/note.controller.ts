import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { CreateNoteusecase } from "../usecases/create-note.usecase";
import { UserRepository } from "../../user/repository/user.repository";
import { ListNotesUsecase } from "../usecases/list-notes.usecase";
import { DeleteNoteUsecase } from "../usecases/delete-note.usecase";
import { UpdateNoteUsecase } from "../usecases/update-note.usercase";

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

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(error, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await new DeleteNoteUsecase().execute(id);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(error, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { idUser, id } = req.params;
      const { title, description, status } = req.body;

      const usecase = new UpdateNoteUsecase();
      const result = await usecase.execute({
        id,
        idUser,
        title,
        description,
        status,
      });

      return res.status(result.code).send(result.data);
    } catch (error: any) {
      return ServerError.genericError(error, res);
    }
  }
}
