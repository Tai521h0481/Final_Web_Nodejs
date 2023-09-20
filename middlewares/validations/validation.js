const validateInput = (requiredFields) => (req, res, next) => {
    for (const field of requiredFields) {
        if (!req.body[field]) {
            res.status(400).json({ error: `Missing field ${field}` });
            return;
        }
        if (typeof req.body[field] === 'string') {
            const value = req.body[field].trim();
            if (value.length === 0) {
                res.status(400).json({ error: `The field ${field} cannot be empty` });
                return;
            }
        }
    }
    next();
};

const isExistId = (Model) => async (req, res, next) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const model = await Model.findById(id);
        if (!model) {
            return res.status(404).json({message: `${Model.name} does not exist with id: ${id}`});
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const isCreated = (Model) => async (req, res, next) => {
    const Email = req.body.Email || req.query.Email || req.params.Email;
    try {
        const user = await Model.findOne({Email});
        if (user) {
            res.status(409).json({ error: "Employee already exists" });
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isExistEmail = (Model) => async (req, res, next) => {
    const Email = req.body.Email || req.query.Email || req.params.Email;
    try {
        const user = await Model.findOne({Email});
        if (!user) {
            res.status(404).json({ error: `Employee ${Email} does not exists` });
        }else{
            next();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isActive = async (req, res, next) => {
    const user = req.user;
    try {
        if(user.data.Role === 'employee' && user.data.IsActive === false){
            res.status(401).json({ error: `You have to change password before` });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    isExistId,
    isCreated,
    validateInput,
    isExistEmail,
    isActive
}