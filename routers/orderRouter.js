const express = require("express")
const authMiddleWare = require("../middleware/authMiddleWare")

const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController")

const orderRouter = express.Router()

orderRouter
    .post("/product/create-order", authMiddleWare, createOrder)

    .get("/product/myorders", authMiddleWare, getUserOrders)

    .get("/product/allOrder", authMiddleWare, getAllOrders)

    .patch("/product/status-update/:id", authMiddleWare, updateOrderStatus)

module.exports = orderRouter