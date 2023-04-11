import { v4 as createUuid } from "uuid";

export enum NoteStatus {
  active = "active",
  filed = "filed",
}

export class Note {
  private _id: string;
  public status: NoteStatus;

  constructor(public title: string, public description: string) {
    this._id = createUuid();
    this.status = NoteStatus.filed;
  }

  public create(
    id: string,
    title: string,
    description: string,
    status: NoteStatus
  ) {
    const note = new Note(title, description);
    note._id = id;
    note.status = status;
  }

  public get id() {
    return this._id;
  }
}
