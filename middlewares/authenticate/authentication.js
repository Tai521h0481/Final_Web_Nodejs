const jwt = require("jsonwebtoken");
require('dotenv').config();

const SECRET_key='tainguyen';

const authentication = (req, res, next) => {
    const token = req.headers || req.body.token || req.query.token || req.cookies?.token;
    if(token){
        try {
            const decoded = jwt.verify(token, SECRET_key);
            if(decoded){
                req.user = decoded;
                next();
            }
            else{
                res.status(401).send("invalid token");
            }
        } catch (error) {
            res.status(401).send(error.message);
        }
    }else{
        res.status(401).send("required token");
    }
}

module.exports = {
    authentication
}