

import { addTransaction, getTransactions, deleteTransaction, updateTransaction, getTransaction, getTransactionsByBudget } from "../controllers/transactionController.js"

import { protectedAction } from "../middleware/authenticateMiddleware.js"

import express from "express"
const router = express.Router()

router.post("/transactions", protectedAction, addTransaction)

router.get("/transactions", protectedAction, getTransactions)

router.get("/transactions/:id", protectedAction, getTransaction)

router.put("/transactions/:id", protectedAction, updateTransaction)

router.delete("/transactions/:id", protectedAction, deleteTransaction)

router.post("/transactions/budget/:budgetId", protectedAction, getTransactionsByBudget)

export default router