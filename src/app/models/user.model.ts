import { v4 as createUuid } from "uuid";
import { Note } from "./note.model";

export class User {
  private _id: string;

  constructor(
    public username: string,
    public password: string,
    public notes?: Note[]
  ) {
    this._id = createUuid();
  }

  public toJson() {
    return {
      id: this._id,
      username: this.username,
      notes: this.notes,
    };
  }

  public static create(id: string, username: string, password: string) {
    const user = new User(username, password);
    user._id = id;
    return user;
  }

  public get id() {
    return this._id;
  }
}
