const mongoose  = require("mongoose")
const bcrypt = require('bcrypt')
const validator = require("validator")
const jwt  = require("jsonwebtoken")
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"]
    },
    email:{
        type:String,
        required:[true,"Please enter the Email"],
        validate:[validator.isEmail,"please Enter the correct Email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please enter the Password'],
        minlength:[6,"Pasword should be atleast 6 characters"]
    },
    role:{
        type:String,
        default:'user'
    },
    forgetPasswordToken:String,
    forgetPasswordExpiry :Date
},{timestamps:true})





// encrypt the password before save
userSchema.pre('save', async function(next){
if(!this.isModified('password')){
    return next()
}



    this.password = await bcrypt.hash(this.password,10)

})


// method  --- validatePassword , CreateJWTTOKEnm ,createForgotPasswordTOken

// validate the password

userSchema.methods.isValiatedPassword = async function(userSendPassword){
    return await bcrypt.compare(userSendPassword,this.password)

}

userSchema.methods.getJwtToken = function() {
    console.log('Generating token for user:', this._id); // Log user ID
    const token = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET, // Corrected typo here
        { expiresIn: process.env.JWT_EXPIRY }
    );
    console.log('Generated token:', token); // Log the generated token
    return token;
};


userSchema.methods.forgotPasswordToken = function(){
    // generate long  and radom string

    const forgotToken = crypto.randomBytes(20).toString('hex')

    this.forgetPasswordToken = crypto.createHash('sha256')
    .update(forgotToken)
    .digest('hex')

    this.forgetPasswordExpiry = Date.now() + 30 *60 *1000

    return forgotToken
}




module.exports = mongoose.model("User",userSchema)