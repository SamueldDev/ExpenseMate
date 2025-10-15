


import { registerUser, loginUser } from "../controllers/userController.js"

import { validateRegistration, validateLogin, validationResultMiddleware } from "../middleware/validationMiddleware.js"

import express from "express"
const router = express.Router();


// registration route
router.post("/register", validateRegistration, validationResultMiddleware, registerUser);

// Login route
router.post("/login", validateLogin, validationResultMiddleware, loginUser);

export default router;
