const nodeMailer = require('nodemailer')
const crypto = require('crypto')

    // generate token
        const generateToken = () => {
            return{
                otp: Math.floor(10000 + Math.random() * 90000).toString(),
                expiry: new Date(Date.now() + 200 * 60 * 100)
            }
        }
    
    //send mail
        const mailSender = async ({mailFrom, mailTo, subject, body}) => {
            try {
                const transporter = nodeMailer.createTransport({
                    host: process.env.HOST,
                    port: process.env.MAIL_PORT,
                    secure: true,
                    auth: {
                        user: process.env.ALH_MAIL,
                        pass: process.env.PASS_KEY
                    }
                })
                // now sends mail
                    const info = await transporter.sendMail({
                        from: mailFrom,
                        to: mailTo,
                        subject,
                        html: body
                    })
                    return info
            } catch (error) {
                console.log(error.message)
            }
        }
        module.exports = {generateToken, mailSender}