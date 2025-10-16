import express from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { TicketController } from '../controllers/TicketController.js';
const router = express.Router();

router.post('/', AuthMiddleware.verifyToken, TicketController.create);
router.get('/:groupId', AuthMiddleware.verifyToken, TicketController.getByGroup);
router.put('/:ticketId', AuthMiddleware.verifyToken, TicketController.updateStatus);

export default router;
