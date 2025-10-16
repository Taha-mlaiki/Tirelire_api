import Ticket from '../models/Ticket.js';

export class TicketRepository {
  async createTicket(data) {
    return await Ticket.create(data);
  }

  async getTicketsByGroup(groupId) {
    return await Ticket.find({ groupId }).populate('createdBy', 'username');
  }

  async updateStatus(ticketId, status) {
    return await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
  }
}
