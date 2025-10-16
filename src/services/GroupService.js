import { GroupRepository } from '../repositories/GroupRepository.js';

export class GroupService {
  constructor() {
    this.groupRepo = new GroupRepository();
  }

  async createGroup({ name, description, owner }) {
    const group = await this.groupRepo.create({
      name,
      description,
      owner,
      members: [owner],
    });
    return group;
  }

  async getAllGroups() {
    return await this.groupRepo.findAll();
  }

  async joinGroup(groupId, userId) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.members.includes(userId)) {
      throw new Error('User already joined the group');
    }

    group.members.push(userId);
    return await this.groupRepo.update(group);
  }

  async leaveGroup(groupId, userId) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new Error('Group not found');
    if (group.owner.toString() === userId) {
      throw new Error("You can't leave your group , try to delete it instead");
    }
    group.members = group.members.filter((m) => m._id.toString() != userId);

    return await this.groupRepo.update(group);
  }

  async updateGroup(groupId, userId, data) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.owner.toString() !== userId) throw new Error('Not authorized');

    group.name = data.name || group.name;
    group.description = data.description || group.description;
    return await this.groupRepo.update(group);
  }

  async deleteGroup(groupId, userId) {
    const group = await this.groupRepo.findById(groupId);
    if (!group) throw new Error('Group not found');

    if (group.owner.toString() !== userId) throw new Error('Not authorized');

    return await this.groupRepo.delete(group);
  }
}
