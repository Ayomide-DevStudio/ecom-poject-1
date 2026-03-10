const express = require('express')
const signIn = require("../controllers/authController")

const authRouter = express.Router()

authRouter
    .post('/user/signin', signIn)





module.exports = authRouter