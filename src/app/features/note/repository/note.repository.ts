import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { Note, NoteStatus } from "../../../models/note.model";
import { NoteEntity } from "../../../shared/database/entities/note.entity";

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

    const result = await this.repository.save(noteEntity);
    return NoteRepository.mapEntityToModel(result);
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

  public async list(idUser: string) {
    const result = await this.repository.find({
      where: {
        idUser,
      },
      relations: ["user"],
    });

    if (result === null) {
      return null;
    }

    return result.map((note) => NoteRepository.mapEntityToModel(note));
  }

  public async getById(id: string) {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ["user"],
    });

    console.log("result", result);

    if (!result) {
      return null;
    }

    return NoteRepository.mapEntityToModel(result);
  }

  public async delete(id: string) {
    const result = await this.repository.delete({
      id,
    });

    return result.affected ?? 0;
  }

  public async update(
    id: string,
    title?: string,
    description?: string,
    status?: NoteStatus
  ) {
    const result = await this.repository.update(
      {
        id,
      },
      {
        title: title,
        description: description,
        status: status,
      }
    );

    if (result.affected === 1) {
      return {
        id,
        title,
        description,
        status,
      };
    }

    return null;
  }

  public static mapEntityToModel(entity: NoteEntity): Note {
    const note = Note.create(
      entity.id.trim(),
      entity.title,
      entity.description,
      entity.idUser,
      entity.status
    );

    return note;
  }
}
