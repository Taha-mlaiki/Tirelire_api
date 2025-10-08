import jwt from 'jsonwebtoken';

export default class JwtUtil {
  static sign(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  static verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
