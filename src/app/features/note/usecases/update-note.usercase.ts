import { Note, NoteStatus } from "../../../models/note.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { NoteReturn } from "../../../shared/utils/noteReturn.contratc";
import { UserRepository } from "../../user/repository/user.repository";
import { NoteRepository } from "../repository/note.repository";

interface uptadeNoteParams {
  id: string;
  idUser: string;
  title?: string;
  description?: string;
  status?: NoteStatus;
}

export class UpdateNoteUsecase {
  public async execute(data: uptadeNoteParams): Promise<NoteReturn> {
    const userRepository = new UserRepository();
    const user = await userRepository.get(data.idUser);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "Usuário não encontrado",
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

    await new CacheRepository().delete(`notesOfUser:${data.idUser}`);

    let dataNote: Note = note;
    if (result?.title) dataNote.title = result.title;
    if (result?.description) dataNote.description = result.description;
    if (result?.status) dataNote.status = result.status;

    return {
      ok: true,
      code: 200,
      message: "Note edit",
      data: dataNote,
    };
  }
}
