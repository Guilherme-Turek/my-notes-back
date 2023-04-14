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
    public user: User
  ) {
    this._id = createUuid();
    this.status = NoteStatus.filed;
  }

  public create(
    id: string,
    title: string,
    description: string,
    user: User,
    status: NoteStatus
  ) {
    const note = new Note(title, description, user);
    note._id = id;
    note.status = status;
  }

  public get id() {
    return this._id;
  }
}
