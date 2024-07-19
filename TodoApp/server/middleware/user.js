const User = require("../models/user");

const jwt = require("jsonwebtoken");
const BigPromise = require("./BigPromise");
const CustomError = require("../utils/CustomError");



const isLoggedIn = BigPromise(async(req,res,next)=>{
    let token;

    // Check if the token is present in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        // Check if the token is present in the Authorization header
        token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
        return next(new CustomError('Login First to access this Page', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new CustomError('User not found', 401));
        }

        next();
    } catch (error) {
        return next(new CustomError('Invalid Token', 401));
    }
})

module.exports =  isLoggedIn