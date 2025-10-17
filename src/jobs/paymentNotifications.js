import cron from 'node-cron';
import { Group } from '../models/Group.js';
import Notification from '../models/Notification.js';

// Define the cron job
export const schedulePaymentNotifications = () => {
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 1 day before payment

    const groups = await Group.find({
      paymentDate: { $gte: today, $lte: tomorrow },
      status: 'active',
    }).populate('members');

    for (const group of groups) {
      for (const member of group.members) {
        await Notification.create({
          user: member._id,
          group: group._id,
          message: `Payment is due soon for group ${group.name} on ${group.paymentDate.toDateString()}`,
        });
      }
    }
    console.log('Payment notifications generated.');
  });
};
