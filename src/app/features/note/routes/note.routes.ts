import { Router } from "express";
import { NoteController } from "../controllers/note.controller";

export const notesRoutes = () => {
  const router = Router();

  router.post("/", new NoteController().create);
  router.get("/", new NoteController().list);

  return router;
};
