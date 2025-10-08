import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { signupSchema } from "../validations/authValidation.js";
import ValidateMiddleware from "../middlewares/ValidateMiddleware.js";

const router = Router();
const controller = new AuthController();

router.post(
  "/register",
  ValidateMiddleware.validate(signupSchema),
  controller.register
);

export default router;
