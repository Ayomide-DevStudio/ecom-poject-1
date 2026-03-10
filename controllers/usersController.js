const userDetails = require('../schemas/usersSchema')
const {generateToken,mailSender} = require('../lib/sendMailer')
const bcrypt =  require('bcrypt')

//using crud
//post,get,delete,put

//Create user(POST)
const createUser = async (req, res) => {
 try {
    const {userName, userEmail, userPassword, role} = req.body

    if (!userName || !userEmail || !userPassword ){
        return res.status(400).json({
            message:  "All fields are required!❌"
        })
    }
    if (userName.length < 3){
        return res.status(400).json({
            message: "Username is too short❌"
        })
    }
    if (userPassword.length < 6){
        return res.status(400).json({
            message: "Password should be atleast 6 characters❌ "
        })
    }
    // to prevent duplicate user
    const userExisted = await userDetails.findOne({userName})
    if (userExisted){
        return res.status(400).json({
            message: "Username already exists ❌.. try another username😉"
        })
    }
    const emailExist =  await userDetails.findOne({userEmail})
    if (emailExist) return res.status(400).json({message: "pls try again , Email exists already😒"})
        
        //HASH PASSWORD
        const hashPass = await bcrypt.hash(userPassword, 15)
        //generate otp
        const {otp, expiry} = generateToken()
    const user = new userDetails ({userName, userEmail, userPassword: hashPass, otp, expiry, role})
    await user.save()

    try {
        const mailObj = {
            mailFrom: `ALH ${process.env.ALH_MAIL}`,
            mailTo: userEmail,
            subject: 'Your OTP code',
            body: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        </head>
                        <body class="bg-gray-100 font-sans m-0 p-0">
                            <div class="w-full bg-gray-100 py-10">
                            <div class="max-w-xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">

                                <div class="bg-indigo-600 px-6 py-4">
                                <h1 class="text-white text-xl font-semibold">
                                    MyApi
                                </h1>
                                </div>

                                <div class="px-6 py-6 text-gray-700">
                                <p class="text-base mb-4">
                                    Hi <span class="font-medium">${userName}</span>,
                                </p>

                                <p class="text-base mb-4">
                                    Thanks for signing up! We’re excited to have you on board.
                                </p>

                                <p class="text-base mb-6">
                                   Here is your OTP code:
                                </p>

                                <div class="text-center mb-6">
                                    <p><b>${otp}</bold></p>
                                </div>
                                <div class="text-center mb-6">
                                    <p>it will expire in <b>${expiry}</bold></p>
                                </div>

                                <p class="text-sm text-gray-500">
                                    If you didn’t request this, you can safely ignore this email.
                                </p>
                                </div>

                                <div class="border-t border-gray-200"></div>

                                <div class="px-6 py-4 text-center text-xs text-gray-500">
                                <p class="mb-1">
                                    © 2026 MyApi. All rights reserved.
                                </p>
                                </div>

                            </div>
                            </div>
                        </body>
                        </html>
                        `

        }
        const info = mailSender(mailObj)
        if (info) return res.status(200).json({message: "Your OTP has been sent 👍"})
        console.log(info)
    } catch (error) {
        res.status(400).json({message: "Failed to send mail"})
    }

    res.status(200).json({user,message: "Account created successfully✅"})

 } catch (error) {
    res.status(500).json(({
        message: error.message
    }))
 }
}


//Edit user(PUT)

const editUser = async(req, res) => {

     const {id} = req.params
     const {userName, userPassword} = req.body
     //validate id
   try {

    if (!userName || !userPassword){
        return res.status(400).json({
            message:  "All fields are required!❌"
        })
    }
    if (userName.length < 3){
        return res.status(400).json({
            message: "Username is too short❌"
        })
    }
    if (userPassword.length < 6){
        return res.status(400).json({
            message: "Password should be atleast 6 characters❌ "
        })
    }

    // to prevent duplicate user
    const userExisted = await userDetails.findOne({userName,
        _id : {$ne: id}
    })
    if (userExisted) return res.status(400).json({message: "Username already exists ❌.. try another username😉"})
        
  
            //hash password

                const hashedPass  =  await bcrypt.hash(userPassword, 12)
            
                const user = await userDetails.findByIdAndUpdate(
                    id,
                    {userName, userPassword: hashedPass},
                    {new: true}
                )
                .select("-userPassword")
                    if (!user) return res.status(400).json({message: "user not found"})
                        res.status(200).json({user})

    
   } catch(error){
    res.status(400).json({
        message : error.message
    })
   }
   
}


//Get single user (GET BY ID)
const getUserById = async (req, res) => {
    try {
            const {id} = req.params      
            const user =  await userDetails.findById(id)
            .select("-userPassword")
            if (!user) return res.status(400).json({message: "user not found😒"})
                res.status(200).json({user, message: "User found👍"})


    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}



const getAllUsers =  async (req, res) => {

    try {
        
        const toGetAllUsers = await userDetails.find().select("-userPassword")
        if (!toGetAllUsers) return res.status(400).json({message: "No user found!😒"})
            res.status(200).json({toGetAllUsers})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const deleteUser =  async (req, res) => {

    try {
         const {id} = req.params
        const toDeleteUser = await userDetails.findByIdAndDelete(id).select("-userPassword")
        if (!toDeleteUser) return res.status(400).json({message: "No user found!😒"})
            res.status(200).json({message: "User deleted successfully ✅"})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

const deleteAllUser =  async (req, res) => {
    try {
        const user = req.user
        if (user.role === 'admin'){
            const deleteAll =  await userDetails.deleteMany({role: { $ne: "admin" }})
            if(!deleteAll) return res.status(400).json({message: "Not authorized to delete all"})
                res.status(200).json({message: "success ✅"})
        }esle[
            res.status(401).json({
                message: "Unauthorized"
            })
        ]
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const verifyOtp = async (req, res) => {
    try {

        const {userName, otp} = req.body

        const user = await userDetails.findOne({userName})

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        // Optional: check expiration
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP expired"
            })
        }

        // Mark user verified
        user.isVerified = true
        user.otp = null
        await user.save()

        res.status(200).json({
            message: "OTP verified successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
module.exports = {
    
    createUser,
    editUser,
    getUserById,
    getAllUsers,
    deleteUser,
    deleteAllUser,
    verifyOtp
}
