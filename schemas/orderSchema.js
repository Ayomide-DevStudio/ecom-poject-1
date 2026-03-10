const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: Number,
            price: Number
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    }

}, { timestamps: true })

module.exports = mongoose.model("orders", orderSchema)