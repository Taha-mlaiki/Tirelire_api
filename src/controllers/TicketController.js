import { TicketService } from '../services/TicketService.js';

export class TicketController {
  static async create(req, res) {
    try {
      const { title, description, groupId } = req.body;
      const createdBy = req.user.id;

      const ticketService = new TicketService();
      const ticket = await ticketService.createTicket({ title, description, groupId, createdBy });

      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getByGroup(req, res) {
    try {
      const { groupId } = req.params;
      const ticketService = new TicketService();
      const tickets = await ticketService.getGroupTickets(groupId);

      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;
      const ticketService = new TicketService();
      const updated = await ticketService.updateTicketStatus(ticketId, status);

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
