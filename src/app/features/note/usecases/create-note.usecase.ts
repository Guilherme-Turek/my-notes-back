import { Note } from "../../../models/note.model";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface CreateNoteParams {
  title: string;
  description: string;
  idUser: string;
}

export class CreateNoteusecase {
  public async execute(data: CreateNoteParams) {
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
    await repository.create(note);

    return {
      ok: true,
      code: 201,
      message: "Note created",
      data: note,
    };
  }
}
