

import cron from "node-cron"
import Budget from "../models/BudgetModel.js";
import sendBudgetReminder from "../utils/sendEmail.js";
import { createNotification } from "../controllers/notificationController.js"

console.log(" Budget reminder job initialized...");

cron.schedule("*/1 * * * *", async () => {
  console.log("🔔 Running daily budget reminder check...");

  const now = new Date();
  const upcoming = new Date();
  upcoming.setDate(now.getDate() + 3); // 3 days ahead

  try {
    
    const budgets = await Budget.find().populate("user", "name email");

    for (const budget of budgets) {
      const { spent_amount, limit_amount, end_date, user, name } = budget;
      const percentUsed = (spent_amount / limit_amount) * 100;

      //  Conditions for alert
      let message = null;
      let alertType = null;

      //  80% usage alert
      if (percentUsed >= 80 && percentUsed < 100 && !budget.sent80PercentAlert ) {
        message = `Your budget <strong>${name}</strong> is ${percentUsed.toFixed(0)}% used. You're nearing your spending limit.`;
        alertType = "sent80PercentAlert";

      //  Exceeded limit alert
      } else if (percentUsed >= 100 && !budget.sentExceededAlert) {
        message = `Your budget <strong>${name}</strong> has been exceeded by ${percentUsed.toFixed(0)}%.`;
        alertType = "sentExceededAlert";


      //  End date reminder
      } else if (end_date <= upcoming && end_date >= now && !budget.sentEndDateAlert) {
        const daysLeft = Math.ceil((end_date - now) / (1000 * 60 * 60 * 24));
        message = `Your budget <strong>${name}</strong> will end in ${daysLeft} day(s).`;
        alertType = "sentEndDateAlert";
      }

      if (message && alertType) {
        // send email
        await sendBudgetReminder(user.email, user.name || "User", message);
        console.log(`📧 Reminder sent to ${user.email} for budget: ${name}`);


         // store in-app notification
         await createNotification(
          user._id,
          "Budget Reminder 💰",
          message,
          "budget"
        );
        console.log(`🔔 Notification stored for user: ${user.email}`);

        // Mark the alert as sent so it won't send again
        budget[alertType] = true;
        await budget.save();
      }
    }

    // console.log(" Daily budget reminder check completed");
  } catch (error) {
    console.error(" Error running budget reminder job:", error);
  }
});




















// cron.schedule("0 8 * * *", async () => {
// runs every 8am everyday

// cron.schedule("*/1 * * * *", async () => {
//   // runs every 1 minute for testing
// });
