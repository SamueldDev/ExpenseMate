import Transaction from "../models/TransactionModel.js";
import Budget from "../models/BudgetModel.js";  
import mongoose from "mongoose";
import { createNotification } from "../controllers/notificationController.js"

// add a transaction
export const addTransaction = async (req, res) => {
    const { name, type, amount, category, date, note, budgetId } = req.body;
    const userId = req.user.id;
    try {
        const newTransaction = new Transaction({
            user: userId,
            budget: budgetId,
            name,
            type,
            amount,
            category,
            date,
            note
        });
        await newTransaction.save();

        // if budgetId is provided, update the spent_amount in the corresponding budget
        if (budgetId) {
            const budget = await Budget.findById(budgetId);
            if (budget) {
                budget.spent_amount += amount;
                await budget.save();
            }
        }

          //  Calculate percentage used
        const budget = await Budget.findById(budgetId);
        const percentUsed = (budget.spent_amount / budget.limit_amount) * 100;

        //  Send notification if nearing/exceeding limit
        if (percentUsed >= 80 && percentUsed < 100) {
          await createNotification(
            userId,
            "Budget Alert ⚠️",
            `Your budget "${budget.name}" is ${percentUsed.toFixed(0)}% used. You're nearing your spending limit.`,
            "budget"
          );
        } else if (percentUsed >= 100) {
          await createNotification(
            userId,
            "Budget Exceeded 🚨",
            `Your budget "${budget.name}" has been exceeded by ${percentUsed.toFixed(0)}%.`,
            "budget"
          );
        }

        res.status(201).json({
            message: "Transaction added successfully",
            transaction: newTransaction
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to add transaction", error: err.message });
    }
};


// get all transactions for a user
export const getTransactions = async (req, res) => {
    const userId = req.user.id;
    try {
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
        res.status(200).json({ message: "Transactions fetched successfully", transactions });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
    }
};


// delete a transaction
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // if the transaction is linked to a budget, update the spent_amount in the corresponding budget
        if (transaction.budget) {
            const budget = await Budget.findById(transaction.budget);
            if (budget) {
                budget.spent_amount -= transaction.amount;
                await budget.save();
            }
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) { 
        res.status(500).json({ message: "Failed to delete transaction", error: err.message });
    }
};


// update a transaction
export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { name, title, amount, category, date, note, budgetId } = req.body;
    const userId = req.user.id;
    try {
        const transaction = await Transaction.findOne({ _id: id, user: userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }


        // if the transaction is linked to a budget, update the spent_amount in the corresponding budget
        if (transaction.budget) {
            const budget = await Budget.findById(transaction.budget);
            if (budget) {
                budget.spent_amount -= transaction.amount; // subtract the old amount
                await budget.save();
            }
        }
        transaction.name = name || transaction.name;
        transaction.title = title || transaction.title;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.date = date || transaction.date;
        transaction.note = note || transaction.note;
        transaction.budget = budgetId || transaction.budget;
        await transaction.save();

        // if budgetId is provided, update the spent_amount in the corresponding budget
        if (budgetId) {
            const budget = await Budget.findById(budgetId);
            if (budget) {
                budget.spent_amount += transaction.amount; // add the new amount
                await budget.save();
            }
        }
        res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update transaction", error: err.message });
    }
};


// get a single transaction
export const getTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const transaction = await Transaction.findOne({ _id: id, user: userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction fetched successfully", transaction });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch transaction", error: err.message });
    }
};


// get transactions by budget
export const getTransactionsByBudget = async (req, res) => {
    const { budgetId } = req.params;
    const userId = req.user.id;
    try {
        const transactions = await Transaction.find({ budget: budgetId, user: userId }).sort({ date: -1 });
        res.status(200).json({ message: "Transactions fetched successfully", transactions });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
    }
};



// get transactions summary (total income and total expense)
export const getTransactionsSummary = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomeAgg = await Transaction.aggregate([
            // { $match: { user: mongoose.Types.ObjectId(userId), type: "income" } },

            { $match: { user: mongoose.Types.ObjectId(userId), type: "income" } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);
        const expenseAgg = await Transaction.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId), type: "expense" } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);
        const totalIncome = incomeAgg[0] ? incomeAgg[0].totalIncome : 0;
        const totalExpense = expenseAgg[0] ? expenseAgg[0].totalExpense : 0;
        res.status(200).json({ message: "Summary fetched successfully", summary: { totalIncome, totalExpense } });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch summary", error: err.message });
    }
};




// summary total(income, expense and balance)
export const getSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const summary = await Transaction.aggregate([

    { $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) } },

      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({ totalIncome, totalExpense, balance });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};



// monthly chart data
export const getMonthlyStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const stats = await Transaction.aggregate([

    { $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) } },

      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          data: { $push: { type: "$_id.type", total: "$total" } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Formatted months for frontend readability
    const result = stats.map((item) => ({
      month: new Date(2025, item._id - 1).toLocaleString("default", { month: "short" }),
      income: item.data.find((d) => d.type === "income")?.total || 0,
      expense: item.data.find((d) => d.type === "expense")?.total || 0
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly stats", error: error.message });
  }
};


//category chart data
export const getCategoryStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const categoryStats = await Transaction.aggregate([

    { $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) } },

      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.category": 1 } }
    ]);

    // Format for easy chart consumption
    const formatted = categoryStats.map((item) => ({
      category: item._id.category || "Uncategorized",
      type: item._id.type,
      total: item.total
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category stats", error: error.message });
  }
};


// filter transactions by date or/and category
export const getTransactionCat = async (req, res) => {
  const userId = req.user.id;
  const { from, to, category } = req.query;

  const filter = { user: userId };

  if (from && to) {
    filter.date = { $gte: new Date(from), $lte: new Date(to) };
  }

  if (category) {
    filter.category = category;
  }

  try {
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};