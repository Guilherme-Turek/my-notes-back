import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { Note, NoteStatus } from "../../../models/note.model";
import { NoteEntity } from "../../../shared/database/entities/note.entity";
import { UserRepository } from "../../user/repository/user.repository";

export class NoteRepository {
  private repository = TypeormConnection.connection.getRepository(NoteEntity);

  public async create(note: Note) {
    const noteEntity = this.repository.create({
      id: note.id,
      title: note.title,
      description: note.description,
      status: NoteStatus.active,
      idUser: note.idUser,
    });

    await this.repository.save(noteEntity);
  }

  public async get(id: string) {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ["user"],
    });

    if (result === null) {
      return null;
    }

    return NoteRepository.mapEntityToModel(result);
  }

  public static mapEntityToModel(entity: NoteEntity): Note {
    const user = UserRepository.mapEntityToModel(entity.user);

    const note = Note.create(
      entity.id,
      entity.title,
      entity.description,
      entity.idUser,
      entity.status
    );

    return note;
  }
}
