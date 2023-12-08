const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_key = process.env.SECRET_key;

const authentication = (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_key);
            if (decoded) {
                req.user = decoded;
                next();
            }
            else {
                res.status(401).send("invalid token");
            }
        } catch (error) {
            res.status(401).send(error.message);
        }
    } else {
        res.status(401).send("required token");
    }
}

const authenticationLinkLogin = async (req, res, next) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_key);
        if (decoded) {
            req.user = decoded;
            next();
        }
        else {
            res.status(401).send("invalid token");
        }
    } catch (error) {
        res.status(401).send(error.message);
    }
}
module.exports = {
    authentication,
    authenticationLinkLogin
}