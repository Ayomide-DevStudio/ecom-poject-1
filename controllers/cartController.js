const cartDetails = require("../schemas/cartSchema")
const productDetails = require("../schemas/productsSchema")



const addToCart = async (req, res) => {
    try {

        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const { product_id, quantity } = req.body

        const product = await productDetails.findById(product_id)
        if (!product) return res.status(404).json({ message: "Product not found" })

        const existing = await cartDetails.findOne({
            user_id: user._id,
            product_id
        })

        if (existing) {
            existing.quantity += quantity || 1
            await existing.save()

            return res.status(200).json({
                message: "Cart updated ✅",
                cart: existing
            })
        }

        const cart = new cartDetails({
            user_id: user._id,
            product_id,
            quantity
        })

        await cart.save()

        res.status(200).json({
            message: "Product added to cart 🛒",
            cart
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCart = async (req, res) => {
    try {

        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const cart = await cartDetails
            .find({ user_id: user._id })
            .populate("product_id")

        res.status(200).json({
            cart,
            message: "Cart retrieved 🛒"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const removeFromCart = async (req, res) => {
    try {

        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const { id } = req.params

        const cart = await cartDetails.findOneAndDelete({
            _id: id,
            user_id: user._id
        })

        if (!cart) return res.status(404).json({ message: "Item not found in cart" })

        res.status(200).json({
            message: "Item removed from cart ❌"
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const clearCart = async (req, res) => {
    try {

        const user = req.user

        if (user.status === 'admin'){
             await cartDetails.deleteMany({ user_id: user._id })

        res.status(200).json({
            message: "Cart cleared 🛒"
        })
        }else{
            res.status(401).json({
                message: "Unauthorized"
            })
        }

       

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
}