const mongoose =  require('mongoose')

const connectDB = async ()=>{
    try {
        console.log("Connecting to mongoDB....")
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected successfully to mongoDB 👍")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB