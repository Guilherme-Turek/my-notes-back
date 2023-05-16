import { Note } from "../../models/note.model";
import { BaseReturn } from "./baseReturn.contract";

export interface NoteReturn extends BaseReturn {
  data?: Note | undefined;
}
