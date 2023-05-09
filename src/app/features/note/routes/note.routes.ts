import { Router } from "express";
import { NoteController } from "../controllers/note.controller";

export const notesRoutes = () => {
  const router = Router();

  router.post("/", new NoteController().create);
  router.get("/", new NoteController().list);
  router.delete("/:id", new NoteController().delete);
  router.put("/:id", new NoteController().update);

  return router;
};
