import UserRepository from '../repositories/UserRepository.js';

export default class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('This email already exists');
      error.status = 400;
      throw error;
    }

    const user = await this.userRepository.create(data);
    if (!user) {
      throw new Error('User creation failed');
    }
  }

  async login(data) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('No user found with this email');
    }
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      const error = new Error('Incorrect credentials');
      error.status = 400;
      throw error;
    }
    delete user.password;
    return user;
  }
}
