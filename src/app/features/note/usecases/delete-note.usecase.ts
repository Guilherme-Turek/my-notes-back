import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { NoteRepository } from "../repository/note.repository";

export class DeleteNoteUsecase {
  public async execute(id: string, idUser: string) {
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
