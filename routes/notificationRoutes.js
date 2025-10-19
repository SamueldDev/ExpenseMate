

import express from "express"
import { markAsRead, getUserNotifications, clearAllNotifications } from "../controllers/notificationController.js";
import { protectedAction } from "../middleware/authenticateMiddleware.js";


const router = express.Router()

router.get("/notifications", protectedAction, getUserNotifications )
router.put("/notifications/:id", protectedAction, markAsRead )
router.delete("/notifications", protectedAction, clearAllNotifications )

export default router;