import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import fs from 'fs';
import { User } from '../models/User.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_PATH = path.join(__dirname, '../face-models');

class KycController {
  constructor() {
    this.loadModels();
  }

  async loadModels() {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
      await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
      console.log('✅ Face-api models loaded');
    } catch (err) {
      console.error('Error loading face-api models:', err);
    }
  }

  async verifyKyc(req, res) {
    try {
      const { userId, idNumber } = req.body;
      const faceImagePath = req.files.faceImage[0].path;
      const idImagePath = req.files.idImage[0].path;

      if (!userId || !idNumber || !faceImagePath || !idImagePath) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Load images
      const faceImg = await canvas.loadImage(faceImagePath);
      const idImg = await canvas.loadImage(idImagePath);

      // Detect faces
      const faceDetection = await faceapi
        .detectSingleFace(faceImg)
        .withFaceLandmarks()
        .withFaceDescriptor();
      const idDetection = await faceapi
        .detectSingleFace(idImg)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!faceDetection || !idDetection) {
        return res.status(400).json({ message: 'Face not detected in one of the images' });
      }

      // Compare faces
      const distance = faceapi.euclideanDistance(faceDetection.descriptor, idDetection.descriptor);

      const isMatch = distance < 0.5;

      if (!isMatch) {
        user.kyc.status = 'rejected';
        user.kyc.faceVerified = false;
        await user.save();
        return res.status(400).json({ message: 'Face verification failed' });
      }

      // Verified
      user.kyc.idNumber = idNumber;
      user.kyc.idImageUrl = idImagePath;
      user.kyc.status = 'verified';
      user.kyc.faceVerified = true;
      await user.save();

      // Clean up uploaded files
      fs.unlinkSync(faceImagePath);
      fs.unlinkSync(idImagePath);

      return res
        .status(200)
        .json({ message: 'KYC verified', user: { id: user._id, kyc: user.kyc } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

export default new KycController();
