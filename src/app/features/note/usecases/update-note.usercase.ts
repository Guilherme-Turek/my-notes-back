import { NoteStatus } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface uptadeNoteParams {
  idUser: string;
  id: string;
  title?: string;
  description?: string;
  status?: NoteStatus;
}

export class UpdateNoteUsecase {
  public async execute(data: uptadeNoteParams) {
    const userRepository = new UserRepository();
    const user = await userRepository.get(data.idUser);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    const noteRepository = new NoteRepository();
    const note = await noteRepository.getById(data.id);

    if (!note) {
      return {
        ok: false,
        code: 404,
        message: "Note not found",
      };
    }

    const result = await noteRepository.update(
      data.id,
      data.title,
      data.description,
      data.status
    );

    await new CacheRepository().delete("notes");

    return {
      ok: true,
      code: 200,
      message: "Note edit",
      data: result,
    };
  }
}
