import { v4 as createUuid } from "uuid";
import { User } from "./user.model";

export enum NoteStatus {
  active = "active",
  filed = "filed",
}

export class Note {
  private _id: string;
  public status: NoteStatus;

  constructor(
    public title: string,
    public description: string,
    public idUser: string
  ) {
    this._id = createUuid();
    this.status = NoteStatus.filed;
  }

  public static create(
    id: string,
    title: string,
    description: string,
    idUser: string,
    status: NoteStatus
  ) {
    const note = new Note(title, description, idUser);
    note._id = id;
    note.status = status;

    return note;
  }

  public toJson() {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      status: this.status,
      idUser: this.idUser,
    };
  }

  public get id() {
    return this._id;
  }
}
