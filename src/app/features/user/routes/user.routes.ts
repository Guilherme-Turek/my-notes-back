import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserValidatorCreate } from "../validators/user.create.validator";

export const userRoutes = () => {
  const router = Router();

  router.post(
    "/",
    [UserValidatorCreate.validateCreate],
    new UserController().create
  );

  return router;
};
