const express = require("express")
const {createCategory} = require("../controllers/categoryController")

const categoryRouter = express.Router()

categoryRouter
    .post("/product-category/create", createCategory)

module.exports = categoryRouter