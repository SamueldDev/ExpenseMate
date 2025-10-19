

import express from "express"
import Budget from "../models/BudgetModel.js";
import sendBudgetReminder from "../utils/sendEmail.js";
import { createNotification } from "../controllers/notificationController.js";


const router = express.Router();

router.get("/test-budget-reminder", async (req, res) => {
  try {
    const budgets = await Budget.find().populate("user", "name email");
    const now = new Date();
    const upcoming = new Date();
    upcoming.setDate(now.getDate() + 3);

    let results = [];

    for (const budget of budgets) {
      const { spent_amount, limit_amount, end_date, user, name } = budget;
      const percentUsed = (spent_amount / limit_amount) * 100;

      let message = null;

      if (percentUsed >= 80 && percentUsed < 100) {
        message = `Your budget <strong>${name}</strong> is ${percentUsed.toFixed(
          0
        )}% used. You're nearing your spending limit.`;
      } else if (percentUsed >= 100) {
        message = `Your budget <strong>${name}</strong> has been exceeded by ${percentUsed.toFixed(
          0
        )}%.`;
      } else if (end_date <= upcoming && end_date >= now) {
        const daysLeft = Math.ceil(
          (end_date - now) / (1000 * 60 * 60 * 24)
        );
        message = `Your budget <strong>${name}</strong> will end in ${daysLeft} day(s).`;
      }

      if (message) {
        // Send Email
        await sendBudgetReminder(user.email, user.name || "User", message);

        // Store Notification
        await createNotification(user._id, "Budget Reminder 💰", message, "budget");

        console.log(` Reminder & notification sent for ${user.email}`);
        results.push({ user: user.email, message });
      }
    }

    res.status(200).json({
      success: true,
      message: "Budget reminder test run completed.",
      results,
    });
  } catch (err) {
    console.error(" Error in test route:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;