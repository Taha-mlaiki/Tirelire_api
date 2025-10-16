import AuthService from '../services/AuthService.js';

export class ProfileMiddleware {
  static async verifiyProfile(req, res, next) {
    try {
      //   const user_id = req.user.id;
      //   const userService = new AuthService();
      //   const user = await userService.findUserById(user_id);
      //   if (!user.kyc.idImageUrl || !user.kyc.faceVerified) {
      //     return res.status(401).json({ message: 'You are not verified' });
      //   }
      next();
    } catch (error) {
      next(error);
    }
  }
}
