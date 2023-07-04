const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authentication = async (req, res, next) => {
    try {
        // checking token is available or not
        const token = req.headers.authorization;
        if (token) {
            // verifying the token
            jwt.verify(token, process.env.Secret_key, async (err, decode) => {
                if (decode) {
                    user = decode["user-id"];
                    next()
                } else {
                    res.status(401).send({
                        status: false,
                        msg: "Invalid token.."
                    })
                }
            })
        } else {
            res.status(401).send({
                status: false,
                msg: "You need to Login.."
            })
        }
    } catch {
        res.status(500).send({
            status: false,
            msg: "Internal server error."
        })
    }
}
