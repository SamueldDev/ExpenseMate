


import { createBudget, getBudgets, deleteBudget, updateBudget, getBudgetDetails, addTransactionToBudget } from "../controllers/budgetController.js"

import { protectedAction } from "../middleware/authenticateMiddleware.js"

import express from "express"
const router = express.Router()

router.post("/budgets", protectedAction, createBudget)

router.get("/budgets", protectedAction, getBudgets)

router.delete("/budgets/:id", protectedAction, deleteBudget)

router.get("/budgets/:id", protectedAction, getBudgetDetails)

router.put("/budgets/:id", protectedAction, updateBudget)

router.post("/budgets/:id/transactions", protectedAction, addTransactionToBudget)


export default router