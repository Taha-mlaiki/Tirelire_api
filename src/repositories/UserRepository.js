import { User } from "../models/User.js";

export default class UserRepository {

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(data) {
    const user = new User(data);
    await user.save({ validateBeforeSave: false });
    return user;
  }

}
