const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
require('dotenv').config();
const {Users} = require('../models');

const SECRET_key = process.env.SECRET_key;
const expiresIn = process.env.expiresIn;
const avatarSize = process.env.avatarSize;
const timeToken = process.env.timeToken;

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const user = await Users.findOne({where: {id}});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createUser = async (req, res) => {
    const {Fullname, Email} = req.body;
    const Password = Email.split('@')[0].toLowerCase();
    const hashPassword = bcrypt.hashSync(Password, 10);
    try {
        Profile_Picture = gravatar.url(Email, { s: avatarSize, r: 'x', d: 'retro' }, true);
        const user = await Users.create({Fullname, Email, Password: hashPassword, Profile_Picture});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const {Name, Email, Password} = req.body;
    try {
        const user = await Users.update({Name, Email, Password}, {where: {id}});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getToken = async (Email, Password) => {
    const user = await Users.findOne({where: {Email}});
    if (user && bcrypt.compareSync(Password, user.Password)) {
        user.IsActive = true;
        const token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
        return token;
    }
    return null;
}

const login = async (req, res) => {
    const {Email, Password} = req.body;
    try {
        const token = await getToken(Email, Password);
        if (token) {
            res.cookie('token', token, { maxAge: timeToken });
            res.status(200).json({token});
        } else {
            res.status(401).json({message: 'Email or password is incorrect'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const upLoadAvatar = async (req, res) => {
    const { file } = req;
    const urlImg = `http://localhost:3000/${file.path}`;
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const user = await User.findByPk(id);
        user.avatar = urlImg;
        await user.save();
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

const logout_removeCookie = (req, res) => {
    const token = res.cookie?.token;
    try {
        const decode = jwt.verify(token, SECRET_key);
        const user = User.findByPk(decode.data.id);
        user.IsActive = false;
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const changePasswordByEmail = async (req, res) => {
    const Email = req.body.Email || req.query.Email || req.params.Email;
    const {Password} = req.body;
    try {
        const hashPassword = bcrypt.hashSync(Password, 10);
        await Users.update({Password: hashPassword}, {where: {Email}});
        res.status(200).json({message: 'Change password successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const changePasswordById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const {Password} = req.body;
    try {
        const hashPassword = bcrypt.hashSync(Password, 10);
        await Users.update({Password: hashPassword}, {where: {id}});
        res.status(200).json({message: 'Change password successfully'});
    }catch (error) {
        res.status(500).json({message: error.message});
    }
}   

const banUser = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const user = await Users.findOne({where: {id}});
        user.IsClocked = true;
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    login,
    upLoadAvatar,
    logout_removeCookie,
    changePasswordByEmail,
    changePasswordById,
}