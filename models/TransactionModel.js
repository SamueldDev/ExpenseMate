

import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        budget: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Budget"
        },
           name: {   // e.g. "Fuel Refill", "Movie Night"
            type: String,
            required: true,
            trim: true
        },
            type:{
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            trim: true
        },
        date:{
            type: Date,
            default: Date.now
        },
        note:{
            type: String,
            trim: true
        },
    },
    { timestamps: true}

)

export default mongoose.model("Transaction", transactionSchema);

