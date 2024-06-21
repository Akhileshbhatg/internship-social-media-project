const sendCookie = (user = {}, statusCode, res) => {
    const token = user.generateToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    
    res.status(statusCode).json({
        success: true,
        token: token,
        user,
    })
}

module.exports = sendCookie;

