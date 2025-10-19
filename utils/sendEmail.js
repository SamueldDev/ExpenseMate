

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ quiet: true});

// Create transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// helper function
const sendBudgetReminder = async (email, name, message) => {
  const mailOptions = {
    from: `"ExpenseMate" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "💰 Budget Remainder",
    text: `
        Hello, ${name}
        ${message}
        Keep tracking your spending wisely with <strong>ExpenseMate</strong> 🧾
        `,

    html: `
        <h2>Hello, ${name}</h2>
        <p>${message}</p>
        <p>Keep tracking your spending wisely with <strong>ExpenseMate</strong> 🧾</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendBudgetReminder;