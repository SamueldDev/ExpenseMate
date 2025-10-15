

import Transaction from "../models/TransactionModel.js";
import Budget from "../models/BudgetModel.js";
import mongoose from "mongoose";


// create a budget
export const createBudget = async (req, res) => {
    const { name, total_amount, limit_amount, start_date, end_date } = req.body;
    const userId = req.user.id;
    try {
        const newBudget = new Budget({
            user: userId,
            name,
            total_amount,
            limit_amount,
            start_date,
            end_date
        });
        await newBudget.save();
        res.status(201).json({
            message: "Budget created successfully",
            budget: newBudget
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to create budget", error: err.message });
    }
};


// get all budgets for a user
export const getBudgets = async (req, res) => {
    const userId = req.user.id;
    try {
        const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Budgets fetched successfully", budgets });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch budgets", error: err.message });
    }
};


// delete a budget
export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const budget = await Budget.findOneAndDelete({ _id: id, user: userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // also delete all transactions associated with this budget
        await Transaction.deleteMany({ budget: id, user: userId });
        res.status(200).json({ message: "Budget and associated transactions deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete budget", error: err.message });
    }
};


// get budget details along with its transactions
export const getBudgetDetails = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid budget ID" });
        }
        const budget = await Budget.findOne({ _id: id, user: userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        const transactions = await Transaction.find({ budget: id, user: userId }).sort({ date: -1 });
        res.status(200).json({
            message: "Budget details fetched successfully",
            budget,
            transactions
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch budget details", error: err.message });
    }
};


// update a budget
export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { name, total_amount, limit_amount, start_date, end_date } = req.body;
    const userId = req.user.id;
    try {
        const budget = await Budget.findOne({ _id: id, user: userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        budget.name = name || budget.name;
        budget.total_amount = total_amount || budget.total_amount;
        budget.limit_amount = limit_amount || budget.limit_amount;
        budget.start_date = start_date || budget.start_date;
        budget.end_date = end_date || budget.end_date;
        await budget.save();
        res.status(200).json({ message: "Budget updated successfully", budget });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update budget", error: err.message });
    }
};


// add a transaction to a budget
export const addTransactionToBudget = async (req, res) => {
    const { id } = req.params; // budget id
    const { title, amount, category, date, note } = req.body;
    const userId = req.user.id;
    try {
        const budget = await Budget.findOne({ _id: id, user: userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        const newTransaction = new Transaction({
            user: userId,
            budget: id,
            title,
            amount,
            category,
            date,
            note
        });
        await newTransaction.save();
        // update the spent_amount in the budget
        budget.spent_amount += amount;
        await budget.save();
        res.status(201).json({
            message: "Transaction added to budget successfully",
            transaction: newTransaction
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add transaction to budget", error: err.message });
    }
};



