const BigPromise = require('../middleware/BigPromise');
const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/CustomError');
const mailHelper = require('../utils/mailHelper');
const crypto = require("crypto");

exports.signUp = BigPromise(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new CustomError("Name, Email, and Password are required for SignUp");
        }

        const user = await User.create({
            name,
            email,
            password
        });

        cookieToken(user, res);
    } catch (error) {
        next(error);
    }
});

exports.login = BigPromise(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError("Please provide email and password to login");
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new CustomError("You are not registered", 400);
        }

        const isPasswordCorrect = await user.isValiatedPassword(password);

        if (!isPasswordCorrect) {
            throw new CustomError("Email and Password do not match", 400);
        }

        cookieToken(user, res);
    } catch (error) {
        next(error);
    }
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logout success"
    });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email , url} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError("You are not registered", 500);
    }

    const forgotToken = user.forgotPasswordToken();

    await user.save({ validateBeforeSave: false });

    const myUrl = `${url}/reset/password/?token=${forgotToken}`;

    const message = `Copy and paste this link in your URL and hit enter \n \n ${myUrl}`;
    try {
        await mailHelper({
            email: user.email,
            subject: "User Password Reset",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });
    } catch (error) {
        user.forgetPasswordExpiry = undefined;
        user.forgetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError(error.message, 500));
    }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;

    const encryptToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        forgetPasswordToken: encryptToken,
        forgetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError('Token is invalid or expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError('Password and confirmPassword do not match', 400));
    }

    user.password = req.body.password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();
// send a Json response or token
    cookieToken(user, res);
});

exports.getUser = BigPromise(async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const id = req.user.id;
    console.log("User ID:", id);

    try {
        const user = await User.findById(id);
        console.log("Found user:", user);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error:", error);
        res.status(502).json({
            message: error.message
        });
    }
});
