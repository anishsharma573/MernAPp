const nodemailer = require("nodemailer")



const mailHelper = async (options)=>{
       const transporter = nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:"anishsharmaf@gmail.com",
            pass:"ugkv ewwz xary jqvv"
        }
       });

       const message={
        from :"anishsharmab@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
       }
       await transporter.sendMail(message)
}

module.exports = mailHelper