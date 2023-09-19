const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
require('dotenv').config();
const { Users } = require('../models');

const SECRET_key = process.env.SECRET_key;
const expiresIn = process.env.expiresIn;
const avatarSize = process.env.avatarSize;
const timeToken = parseInt(process.env.timeToken);
const userMail = process.env.userMail;
const passMail = process.env.passMail;
const BASE_URL = process.env.BASE_URL;
const pageChangePassword = process.env.pageChangePassword;
let linkLogin = `${BASE_URL}${pageChangePassword}`;
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: userMail,
        pass: passMail
    }
});

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({ Role: "employee" }).select('-Password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const user = await Users.findById(id).select('-Password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const sendEmail = (Email, res) => {
    Email = Email.toLowerCase();
    const token = jwt.sign({ Email }, SECRET_key, { expiresIn: '1m' }); // Token expires in 1 minute
    linkLogin += `?token=${token}`;
    let mailOptions = {
        from: userMail,
        to: Email,
        subject: 'Welcome to Our App',
        text: `Please click the link to login: ${linkLogin}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(200).json({ message: "Email sent" });
        }
    });
    return;
}

const resendEmail = async (req, res) => {
    let Email = req.body.Email || req.query.Email || req.params.Email;
    try {
        sendEmail(Email, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    let { Fullname, Email } = req.body;
    try {
        Email = Email.toLowerCase();
        const Password = Email.split('@')[0];
        Profile_Picture = gravatar.url(Email, { s: avatarSize, r: 'x', d: 'retro' }, true);
        await Users.create({ Fullname, Email, Password, Profile_Picture });
        sendEmail(Email, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getToken = async (Email, Password) => {
    const user = await Users.findOne({ Email: Email });
    if (user && user.Password === Password) {
        user.IsOnline = true;
        await user.save();
        const userObject = user.toObject();
        delete userObject.Password;
        const token = jwt.sign({ data: userObject }, SECRET_key, { expiresIn });
        return token;
    }
    return null;
}

const login = async (req, res) => {
    let { Email, Password } = req.body;
    try {
        Email = Email.toLowerCase();
        const token = await getToken(Email, Password);
        if (token) {
            const user = await Users.findOne({ Email: Email }).select('-Password');
            user.IsActive = true;
            res.cookie('token', token, { maxAge: timeToken });
            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Email or password is incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const upLoadAvatar = async (req, res) => {
    const { file } = req;
    const urlImg = `http://localhost:3000/${file.path}`;
    const id = req.params.id || req.body.id || req.query.id;
    try {
        await Users.findByIdAndUpdate(id, { Profile_Picture: urlImg }, { new: true });
        res.status(200).send({ message: `Upload avatar successfully` });
    }
    catch (error) {
        res.status(500).send(error);
    }
}

const logout_removeCookie = async (req, res) => {
    const token = req.headers.token || req.body.token || req.query.token || req.cookies?.token;
    try {
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
        } else {
            const decode = jwt.verify(token, SECRET_key);
            const user = Users.findByPk(decode.data.id);
            user.IsOnline = false;
            await user.save();
            res.clearCookie('token');
            res.status(200).json({ message: "Logout successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const changePasswordByEmail = async (req, res) => {
    let Email = req.body.Email || req.query.Email || req.params.Email;
    const { Password } = req.body;
    try {
        Email = Email.toLowerCase();
        await Users.findOneAndUpdate({Email}, {Password});
        res.status(200).json({ message: 'Changed password successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const changePasswordById = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    const { Password } = req.body;
    try {
        await Users.findByIdAndUpdate(id, {Password});
        res.status(200).json({ message: 'Changed password successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const banUser = async (req, res) => {
    const id = req.params.id || req.body.id || req.query.id;
    try {
        const user = await Users.findOne({ where: { id } });
        user.IsLocked = true;
        await user.save();
        res.status(200).json({message: `Employee ${user.Fullname} is locked`});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    login,
    upLoadAvatar,
    logout_removeCookie,
    changePasswordByEmail,
    changePasswordById,
    banUser,
    resendEmail
}