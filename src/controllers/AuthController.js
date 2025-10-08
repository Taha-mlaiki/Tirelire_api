import AuthService from "../services/AuthService.js";

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      await this.authService.register(req.body);
      return res.status(201).json({
        success: "Registered successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
