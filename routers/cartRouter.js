const express = require('express')
const authMiddleWare = require('../middleware/authMiddleWare')

const {addToCart, getCart, removeFromCart, clearCart} = require("../controllers/cartController")


const cartRouter =  express.Router()

cartRouter
    .post('/product/addtocart', authMiddleWare, addToCart)
    .get('/product/getcart', authMiddleWare, getCart)
    .delete('/product/removefromcart/:id', authMiddleWare, removeFromCart)
    .delete('/product/clearcart', authMiddleWare, clearCart)

module.exports = cartRouter