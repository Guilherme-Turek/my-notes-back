import { Router } from "express";
import { LoginController } from "../controllers/login.controller";
import { LoginValidator } from "../validators/login.validator";

export const loginRoutes = () => {
  const router = Router();

  router.post(
    "/",
    [LoginValidator.MandatoryFields, LoginValidator.ValidateData],
    new LoginController().login
  );

  return router;
};
