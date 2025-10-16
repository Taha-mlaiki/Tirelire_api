import express from 'express';
import { GroupController } from '../controllers/GroupController.js';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { ProfileMiddleware } from '../middlewares/ProfileMiddleware.js';

const router = express.Router();
const controller = new GroupController();

router.use(AuthMiddleware.verifyToken);

router.post('/', ProfileMiddleware.verifiyProfile, controller.create);
router.get('/', controller.getAll);
router.post('/:id/join', ProfileMiddleware.verifiyProfile, controller.join);
router.post('/:id/leave', controller.leave);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
