import { Request, Response } from "express";
import { ServerError } from "../../../shared/errors/server.error";
import { CreateNoteUsecase } from "../usecases/create-note.usecase";
import { UserRepository } from "../../user/repository/user.repository";
import { ListNotesUsecase } from "../usecases/list-notes.usecase";
import { DeleteNoteUsecase } from "../usecases/delete-note.usecase";
import { UpdateNoteUsecase } from "../usecases/update-note.usercase";

export class NoteController {
  public async create(req: Request, res: Response) {
    try {
      const { idUser } = req.params;
      const { title, description } = req.body;

      const usecase = new CreateNoteUsecase();
      const result = await usecase.execute({
        title,
        description,
        idUser,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { idUser } = req.params;

      const result = await new ListNotesUsecase().execute(idUser);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id, idUser } = req.params;

      const result = await new DeleteNoteUsecase().execute(id, idUser);

      return res.status(result.code).send(result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id, idUser } = req.params;
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
      return ServerError.genericError(res, error);
    }
  }
}
