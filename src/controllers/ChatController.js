import { ChatService } from '../services/ChatService.js';

export class ChatController {
  static async sendMessage(req, res) {
    try {
      const { groupId, message } = req.body;
      const audioUrl = req.file ? req.file.path : null;
      const senderId = req.user.id;

      const chatService = new ChatService();
      const newMessage = await chatService.sendMessage(groupId, senderId, message, audioUrl);

      res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { groupId } = req.params;
      const chatService = new ChatService();
      const messages = await chatService.fetchGroupMessages(groupId);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
