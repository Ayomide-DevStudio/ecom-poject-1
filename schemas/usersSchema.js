const mongoose =  require('mongoose')

const userSchema  =  new mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    userEmail : {
        type: String,
        required: true,
        unique: true
    },
    userPassword : {
        type: String,
        required: true
    },
    otp: String,
    expiry: Date,
    verified: {
        type: Boolean,
        Default: false
    },
    role: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

const userDetails =  mongoose.model('User', userSchema)

module.exports = userDetails