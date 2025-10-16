import { ChatRepository } from '../repositories/ChatRepository.js';

export class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
  }

  async sendMessage(groupId, senderId, content, audioUrl = null) {
    return await this.chatRepository.createMessage({
      groupId,
      senderId,
      message: content,
      audioUrl,
    });
  }

  async fetchGroupMessages(groupId) {
    return await this.chatRepository.getMessagesByGroup(groupId);
  }
}
