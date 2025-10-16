import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Database from './config/database.js';
import ErrorMiddleware from './middlewares/ErrorMiddleware.js';
import bodyParser from 'body-parser';
// routes
import groupRoutes from './routes/group.routes.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use('/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/payments', paymentRoutes);
app.use('/stripe', stripeWebhookRoutes); // webhook route, no auth
// Middleware global d’erreur
app.use(ErrorMiddleware.handle);

// Connexion DB + lancement serveur
const PORT = process.env.PORT || 4000;

Database.connect().then(() => {
  app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
});

export default app;
