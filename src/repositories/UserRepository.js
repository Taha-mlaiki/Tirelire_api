import { User } from '../models/User.js';

export default class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }
  async create(data) {
    const user = new User(data);
    await user.save({ validateBeforeSave: false });
    return user;
  }
}
