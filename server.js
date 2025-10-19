
import express from "express"
import dotenv from "dotenv"
dotenv.config({ quiet: true })
import cors from "cors"
import connectDB from "./config/db.js"

import userRoutes from "./routes/userRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import testBudgetRoutes from "./routes/testBudgetRoutes.js"  
import "./jobs/budgetRemainderJob.js"    

const PORT = process.env.PORT || 5000        
const app = express();
connectDB();  

app.use(cors());
app.use(express.json());         

// routes
app.get("/", (req, res) => {    
    res.send(" expenseMate server is live")  
})

app.use("/api/users", userRoutes)       
app.use("/api", budgetRoutes)    
app.use("/api", transactionRoutes)    
app.use("/api", notificationRoutes)      
app.use("/api", testBudgetRoutes)    


app.listen(PORT, () => {  
    console.log(`server running on http://localhost:${PORT}`)
})

