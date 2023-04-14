import cors from "cors";
import express from "express";
import { userRoutes } from "../../app/features/user/routes/user.routes";
import { loginRoutes } from "../../app/features/login/routes/login.routes";
import { notesRoutes } from "../../app/features/note/routes/note.routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/users", userRoutes());
  app.use("/login", loginRoutes());
  app.use("/users/:idUser/notes", notesRoutes());

  return app;
};
