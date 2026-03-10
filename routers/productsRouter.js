const express = require('express')

const {createProduct, editProduct, getProductById, getAllProducts, deleteProductById, deleteAllProduct, getProductsByCategory} = require("../controllers/productsController")
const authMiddleWare = require('../middleware/authMiddleWare')

const productRouter = express.Router()

productRouter
    .post('/product/create-product', authMiddleWare, createProduct)
    .put('/product/edit-product/:id',authMiddleWare, editProduct)
    .get('/product/get-product/:id', getProductById)
    .get('/product/get-AllProduct', getAllProducts)
    .delete('/product/deleteProduct/:id', authMiddleWare, deleteProductById)
    .delete('/product/deleteAllProduct', authMiddleWare, deleteAllProduct)
    .get('/product/product-category/:category_id', getProductsByCategory)






module.exports = productRouter