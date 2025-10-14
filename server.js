

import express from "express"
import dotenv from "dotenv"
dotenv.config({ quiet: true })
import cors from "cors"
import connectDB from "./config/db.js"


const PORT = process.env.PORT || 5000
const app = express();
connectDB();  

app.use(cors());
app.use(express.json());   


app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})

