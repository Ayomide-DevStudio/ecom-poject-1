const userDetails =  require ("../schemas/usersSchema")
const bcrypt = require('bcrypt')
const getToken =  require("../helpers/getToken")



const signIn = async (req, res) => {

    try {
        
        const {userEmail, userPassword} =  req.body
            if (!userEmail || !userPassword) {
                res.status(400).json({message: "Please provide all fields"})
                return 
            } else{
                const user =  await userDetails.findOne({userEmail})
                if (!user) return res.status(400).json({message: "User does not exist ❎"})
                    const pass = await bcrypt.compare(userPassword.trim(), user.userPassword)
                        if (!pass) return res.status(400).json({message: "email or password is incorrect😒"})
                            const token = getToken(user._id)
                             return res
                                        .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
                                        .status(200)
                                        .json({message: "You have signed in successfully ✅"})
            }
            
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}

module.exports = signIn