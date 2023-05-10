import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { NoteRepository } from "../repository/note.repository";

export class ListNotesUsecase {
  public async execute(idUser: string) {
    const cacheReposiroty = new CacheRepository();
    const cachedResult = await cacheReposiroty.get(`notesOfUser:${idUser}`);

    if (cachedResult !== null) {
      return {
        ok: true,
        code: 201,
        message: "Notes listed -- Cache",
        data: cachedResult,
      };
    }

    const database = new NoteRepository();
    let notes = await database.list(idUser);

    const result = notes?.map((note) => note.toJson());

    await cacheReposiroty.set(`notesOfUser:${idUser}`, result);

    return {
      ok: true,
      code: 201,
      message: "Notes listed",
      data: result,
    };
  }
}
