import AuthService from "../services/AuthService.js";
import { signupSchema } from "../validations/authValidation.js";

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const res = await this.authService.register(req.body);
      res.status(201).json({
        message: "Registered successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
