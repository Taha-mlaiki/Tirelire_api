import Chat from '../models/Chat.js';

export class ChatRepository {
  async createMessage(data) {
    return await Chat.create(data);
  }

  async getMessagesByGroup(groupId) {
    return await Chat.find({ groupId }).populate('senderId', 'username');
  }
}
