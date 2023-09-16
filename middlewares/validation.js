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
        const model = await Model.findOne({where: {id}});
        if (!model) {
            return res.status(404).json({message: `${Model.name} does not exist with id: ${id}`});
        }
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const isCreated = (Model) => async (req, res, next) => {
    const { Email } = req.body;
    try {
        const user = await Model.findOne({ where: { Email } });
        if (user) {
            res.status(409).json({ error: "User already exists" });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    isExistId,
    isCreated,
    validateInput
}