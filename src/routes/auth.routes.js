import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { loginSchema, signupSchema } from "../validations/authValidation.js";
import ValidateMiddleware from "../middlewares/ValidateMiddleware.js";

const router = Router();
const controller = new AuthController();

router.post(
  "/register",
  ValidateMiddleware.validate(signupSchema),
  controller.register
);
router.post(
  "/login",
  ValidateMiddleware.validate(loginSchema),
  controller.login
);

export default router;
