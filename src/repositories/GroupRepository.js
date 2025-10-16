import { Group } from '../models/Group.js';

export class GroupRepository {
  async create(data) {
    return await Group.create(data);
  }

  async findAll() {
    return await Group.find().populate('owner', 'name').populate('members', 'name');
  }

  async findById(id) {
    return await Group.findById(id).populate('members', 'name');
  }

  async update(group) {
    return await group.save();
  }

  async delete(group) {
    return await group.deleteOne();
  }
}
