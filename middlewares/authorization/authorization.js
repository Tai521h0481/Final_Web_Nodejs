const authorization = (authorizedList) => (req, res, next) => {
    const {user} = req;
    try {
        if(authorizedList.includes(user.data.Role.toLowerCase())){
            next();
        }
        else{
            res.status(403).send("You are logged in but do not have permission to perform this action");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    authorization
}