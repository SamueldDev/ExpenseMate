

import mongoose from "mongoose"

const budgetSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        total_amount:{
            type: Number,
            required: true
        },
        spent_amount:{
            type: Number,
            default: 0
        },
        limit_amount:{
            type: Number,
            required: true
        },
        start_date:{
            type: Date,
            required: true
        },
        end_date:{
            type: Date,
            required: true
        },

        // reminder flag
        sent80PercentAlert: { 
            type: Boolean, 
            default: false 
        },
        sentExceededAlert: { 
            type: Boolean, 
            default: false 
        },
        sentEndDateAlert: { 
            type: Boolean, 
            default: false 
        },
    },
    { timestamps: true }
)

export default mongoose.model("Budget", budgetSchema)