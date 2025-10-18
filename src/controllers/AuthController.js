import AuthService from '../services/AuthService.js';
import JwtUtil from '../utils/jwtUtil.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      await this.authService.register(req.body);
      return res.status(201).json({
        success: 'Registered successfully',
      });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const user = await this.authService.login(req.body);
      const token = JwtUtil.sign({
        email: user.email,
        id: user.id,
        role: user.role,
      });
      return res.status(200).json({
        success: 'Loged in successfully',
        user,
        token,
      });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  };
}
