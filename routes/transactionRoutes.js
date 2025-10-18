

import { addTransaction, getTransactions, deleteTransaction, updateTransaction, getTransaction, getTransactionsByBudget, getSummary, getMonthlyStats, getCategoryStats, getTransactionCat    } from "../controllers/transactionController.js"

import { protectedAction } from "../middleware/authenticateMiddleware.js"

import express from "express"
const router = express.Router()

// Analytic route(static route)
router.get("/transactions/summary", protectedAction, getSummary)

router.get("/transactions/monthly", protectedAction, getMonthlyStats)

router.get("/transactions/categories", protectedAction, getCategoryStats)

router.get("/transactions", protectedAction, getTransactionCat)


// static route
router.post("/transactions", protectedAction, addTransaction)

router.get("/transactions", protectedAction, getTransactions)

router.get("/transactions/:id", protectedAction, getTransaction)

router.put("/transactions/:id", protectedAction, updateTransaction)

router.delete("/transactions/:id", protectedAction, deleteTransaction)

router.get("/transactions/budget/:budgetId", protectedAction, getTransactionsByBudget)





export default router