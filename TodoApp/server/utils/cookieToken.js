const cookieToken = (user, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure secure cookie in production
        sameSite: 'Strict' // Prevent CSRF
    };

    // Clear the password before sending the response
    user.password = undefined;

    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
};

module.exports = cookieToken;
