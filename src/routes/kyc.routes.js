import express from 'express';
import multer from 'multer';
import KycController from '../controllers/KycController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/verify',
  upload.fields([
    { name: 'faceImage', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
  ]),
  (req, res) => KycController.verifyKyc(req, res)
);

export default router;
