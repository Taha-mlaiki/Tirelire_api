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

    const user = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      kyc: {
        idNumber: data.ID,
      },
    });

    if (!user) {
      throw new Error('User creation failed');
    }
  }

  async login(data) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      const error = new Error('No user found with this email');
      error.status = 400;
      throw error;
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

  async findUserById(id) {
    const user = this.userRepository.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }
}
