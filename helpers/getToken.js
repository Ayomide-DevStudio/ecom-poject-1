 const jwt =  require("jsonwebtoken")

 const secret_key =  process.env.SECRET_KEY


 const getToken = (id) => {
    return jwt.sign({id}, secret_key, {expiresIn: "60m"})
    
}
module.exports = getToken