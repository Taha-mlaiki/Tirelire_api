import express from 'express';
import multer from 'multer';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { ChatController } from '../controllers/ChatController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/audio/' }); // handle audio uploads

router.post(
  '/send',
  AuthMiddleware.verifyToken,
  upload.single('audio'),
  ChatController.sendMessage
);
router.get('/:groupId', AuthMiddleware.verifyToken, ChatController.getMessages);

export default router;
