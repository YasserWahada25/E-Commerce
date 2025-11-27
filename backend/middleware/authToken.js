const jwt = require('jsonwebtoken')

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                console.log("error auth", err)
                return res.status(401).json({
                    message: "Unauthorized access",
                    error: true,
                    success: false
                })
            }

            req.userId = decoded?._id

            next()
        });


    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        })
    }
}


module.exports = authToken