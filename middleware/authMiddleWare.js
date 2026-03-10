const userDetails =  require ("../schemas/usersSchema")
 const jwt =  require("jsonwebtoken")

const authMiddleWare = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    //req.cookies.token
     //console.log(token)
    const passKey = process.env.SECRET_KEY
        if(!token) return res.status(401).json({message: "Unauthorized"})
                try {
                    const verifiedToken = jwt.verify(token, passKey)
                        if (!verifiedToken) return res.status(401).json({message: "Invalid token "})
                            const user =  await userDetails.findById(verifiedToken.id).select("-userPassword")
                                if (!user) return res.status(401).json({message: "Unable to get User"})
                                    req.user = user
                                        next()

                } catch (error) {
                    res.status(401).json({
                        message: "Invalid or expired token"
                    })
                }

    }
module.exports = authMiddleWare