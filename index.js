
require('dotenv').config()
const express = require('express')
const userRouter = require('./routers/usersRoute')
const connectDB =  require('./mongodb/dbconnection')
const productRouter = require('./routers/productsRouter')
const authRouter = require('./routers/authRouter')
const cartRouter = require('./routers/cartRouter')
const categoryRouter = require('./routers/categoryRouter')
const orderRouter = require('./routers/orderRouter')
const cookieParser = require('cookie-parser')




connectDB()

const server = express()
const port = process.env.PORT || 3000

//middleware
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())


//router
server.use('/api', userRouter)
server.use('/api', productRouter)
server.use('/api', authRouter)
server.use('/api', cartRouter)
server.use('/api', categoryRouter)
server.use('/api', orderRouter)

app.get("/", (req, res) => {
    res.json({ message: "API running on Vercel 🚀" })
})

// server.listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// })
