import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

export class ListNotesUsecase {
  public async execute(idUser: string) {
    const userRepository = new UserRepository();
    const user = await userRepository.get(idUser);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado",
      };
    }
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
