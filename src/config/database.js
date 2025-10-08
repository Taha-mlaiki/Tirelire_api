import mongoose from 'mongoose';

export default class Database {
  static async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connecté');
    } catch (error) {
      console.error('Erreur de connexion MongoDB :', error.message);
      process.exit(1);
    }
  }
}
