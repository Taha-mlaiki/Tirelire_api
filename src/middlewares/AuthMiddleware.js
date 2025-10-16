import jwt from 'jsonwebtoken';

export class AuthMiddleware {
  static verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to request
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }
}
