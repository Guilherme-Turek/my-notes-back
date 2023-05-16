import { Note } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { NoteReturn } from "../../../shared/utils/noteReturn.contratc";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface CreateNoteParams {
  title: string;
  description: string;
  idUser: string;
}

export class CreateNoteUsecase {
  public async execute(data: CreateNoteParams): Promise<NoteReturn> {
    const userRepository = new UserRepository();
    const user = await userRepository.get(data.idUser);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado",
      };
    }

    const note = new Note(data.title, data.description, user.id);

    const repository = new NoteRepository();
    const result = await repository.create(note);

    const cacheReposiroty = new CacheRepository();
    await cacheReposiroty.delete(`notesOfUser:${data.idUser}`);

    return {
      ok: true,
      code: 201,
      message: "Note created",
      data: result,
    };
  }
}
