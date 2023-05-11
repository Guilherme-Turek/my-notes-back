import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

export class DeleteNoteUsecase {
  public async execute(id: string, idUser: string) {
    const userRepository = new UserRepository();
    const user = await userRepository.get(idUser);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado",
      };
    }
    const repository = new NoteRepository();
    const result = await repository.delete(id);

    if (result === 0) {
      return {
        ok: false,
        message: "Note not found",
        code: 404,
      };
    }

    const cacheReposiroty = new CacheRepository();
    await cacheReposiroty.delete(`notesOfUser:${idUser}`);

    return {
      ok: true,
      data: id,
      message: "Note was successfully deleted",
      code: 200,
    };
  }
}
