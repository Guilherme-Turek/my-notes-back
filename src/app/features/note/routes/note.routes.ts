import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { NotesValidator } from "../validators/notes-validator";

export const notesRoutes = () => {
  const router = Router();

  router.post(
    "/:idUser/notes",
    [NotesValidator.MandatoryFields],
    new NoteController().create
  );
  router.get("/:idUser/notes", new NoteController().list);
  router.delete("/:idUser/notes/:id", new NoteController().delete);
  router.put("/:idUser/notes/:id", new NoteController().update);

  return router;
};
