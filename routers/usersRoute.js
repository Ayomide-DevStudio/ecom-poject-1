const express = require('express')
const authMiddleWare = require('../middleware/authMiddleWare')
const {createUser, editUser, getUserById, getAllUsers, deleteUser, deleteAllUser, verifyOtp} = require("../controllers/usersController")


const userRouter =  express.Router()

// create a user api
userRouter
    .post('/user/signup', createUser)
    //to edit user
    .put('/user/edit-user/:id',authMiddleWare, editUser)
    //to get a single user
    .get('/user/get-user/:id', getUserById)
    //get all user
    .get('/user/getAllUsers', getAllUsers)
    //delete user
    .delete('/user/delete-user/:id',authMiddleWare, deleteUser)

    .delete('/user/delete-all',authMiddleWare, deleteAllUser)

    .post('/user/verify-otp', verifyOtp)








        module.exports = userRouter
