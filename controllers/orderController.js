const orderDetails = require("../schemas/orderSchema")
const cartDetails = require("../schemas/cartSchema")
const productDetails = require("../schemas/productsSchema")

const createOrder = async (req, res) => {
    try {

        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const cart = await cartDetails
            .find({ user_id: user._id })
            .populate("product_id")

        if (!cart.length) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        let totalPrice = 0

        const items = cart.map(item => {

            const price = item.product_id.LaptopPrice

            totalPrice += price * item.quantity

            return {
                product_id: item.product_id._id,
                quantity: item.quantity,
                price
            }
        })

        const order = new orderDetails({
            user_id: user._id,
            items,
            totalPrice
        })

        await order.save()

        await cartDetails.deleteMany({ user_id: user._id })

        res.status(200).json({
            order,
            message: "Order created successfully 🛒"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getUserOrders = async (req, res) => {
    try {

        const user = req.user

        if(!user) return res.status(401).json({message: "Unauthorized"})

        const orders = await orderDetails
            .find({ user_id: user._id })
            .populate("items.product_id")

        res.status(200).json({
            orders,
            message: "Orders retrieved"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getAllOrders = async (req, res) => {
    try {

        const user = req.user
        //console.log(user)

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin only"
            })
        }

        const orders = await orderDetails
            .find()
            .populate("user_id", "username")
            .populate("items.product_id")

        res.status(200).json({
            orders
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {

        const user = req.user
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Admin only"
            })
        }

        const { id } = req.params
        const { status } = req.body

        const order = await orderDetails.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        res.status(200).json({
            order,
            message: "Order status updated"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
}