import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

export class ListNotesUsecase {
  public async execute(idUser: string) {
    const database = new NoteRepository();
    let notes = await database.list(idUser);

    const result = notes?.map((note) => note.toJson());

    return {
      ok: true,
      code: 201,
      message: "Notes listed",
      data: result,
    };
  }
}
