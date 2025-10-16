import { TicketRepository } from '../repositories/TicketRepository.js';

export class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async createTicket(data) {
    return await this.ticketRepository.createTicket(data);
  }

  async getGroupTickets(groupId) {
    return await this.ticketRepository.getTicketsByGroup(groupId);
  }

  async updateTicketStatus(ticketId, status) {
    return await this.ticketRepository.updateStatus(ticketId, status);
  }
}
