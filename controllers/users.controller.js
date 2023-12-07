const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
require("dotenv").config();
const { Users } = require("../models");

const SECRET_key = process.env.SECRET_key;
const expiresIn = process.env.expiresIn;
const avatarSize = process.env.avatarSize;
const timeToken = parseInt(process.env.timeToken);
const userMail = process.env.userMail;
const passMail = process.env.passMail;
const BASE_URL = process.env.BASE_URL;
const pageChangePassword = process.env.pageChangePassword;
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "hotmail",
  // service: 'gmail',
  auth: {
    user: userMail,
    pass: passMail,
  },
});

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({ Role: "employee" }).select("-Password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id || req.body.id || req.query.id;
  try {
    const user = await Users.findById(id).select("-Password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendEmail = (Email) => {
  let linkLogin = `${BASE_URL}${pageChangePassword}`;
  Email = Email.toLowerCase();
  const token = jwt.sign({ Email }, SECRET_key, { expiresIn: "1m" }); // Token expires in 1 minute
  linkLogin += `?token=${token}`;
  let mailOptions = {
    from: userMail,
    to: Email,
    subject: "Welcome to Our App",
    text: `Please click the link to login: ${linkLogin}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error.message);
      } else {
        resolve("Email sent");
      }
    });
  });
};

const resendEmail = async (req, res) => {
  let Email = req.body.Email || req.query.Email || req.params.Email;
  let responseSent = false;
  try {
    const message = await sendEmail(Email).catch((error) => {
      if (!responseSent) {
        res.status(500).json({ message: error.message });
        responseSent = true;
      }
    });
    if (!responseSent) {
      res.status(200).json({ message });
    }
  } catch (error) {
    if (!responseSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

const createUser = async (req, res) => {
  let { Fullname, Email } = req.body;
  let responseSent = false;
  try {
    Email = Email.toLowerCase();
    const Username = Email.split("@")[0];
    const Password = Email.split("@")[0];
    Profile_Picture = gravatar.url(
      Email,
      { s: avatarSize, r: "x", d: "retro" },
      true
    );
    const user = await Users.create({
      Username,
      Fullname,
      Email,
      Password,
      Profile_Picture,
    });
    const message = await sendEmail(Email).catch((error) => {
      if (!responseSent) {
        res.status(500).json({ message: error.message });
        responseSent = true;
      }
    });
    if (!responseSent) {
      user.Password = undefined;
      res.status(200).json({ message, user });
    }
  } catch (error) {
    if (!responseSent) {
      res.status(500).json({ message: error.message });
    }
  }
};

const login = async (req, res) => {
  let { Email, Password } = req.body;
  try {
    Email = Email.toLowerCase();
    const user = await Users.findOneAndUpdate(
      { Username: Email, Password },
      { IsOnline: true, FirstLogin: true },
      { new: true }
    )
      .select("-Password")
      .populate("Orders");
    if (!user) {
      res.status(401).json({ message: "Email or password is incorrect" });
      return;
    }
    const token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.cookie("token", token, { maxAge: timeToken });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upLoadAvatar = async (req, res) => {
  const id = req.params.id || req.body.id || req.query.id;
  const { imageUrl } = req.body;
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { Profile_Picture: imageUrl },
      { new: true }
    ).select("-Password");
    const token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.cookie("token", token, { maxAge: timeToken });
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send(error);
  }
};

const logout_removeCookie = async (req, res) => {
  const token =
    req.headers.token ||
    req.body.token ||
    req.query.token ||
    req.cookies?.token;
  try {
    if (!token) {
      res.status(401).json({ message: "You have to login before" });
    } else {
      const decode = jwt.verify(token, SECRET_key);
      if (!decode) {
        res.status(401).json({ message: "Token is invalid" });
        return;
      }
      await Users.findByIdAndUpdate(decode.data._id, { IsOnline: false });
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePasswordByEmail = async (req, res) => {
  let Email = req.body.Email || req.query.Email || req.params.Email;
  let token =
    req.headers.token ||
    req.body.token ||
    req.query.token ||
    req.cookies?.token;
  const { Password } = req.body;
  try {
    if (!token) {
      res.status(401).json({ message: "You have to login before" });
      return;
    }
    const decode = jwt.verify(token, SECRET_key);
    if (!decode) {
      res.status(401).json({ message: "Token is invalid" });
      return;
    }
    Email = Email.toLowerCase();
    if (Email !== decode.data.Username) {
      res.status(401).json({
        message: `You are not allowed to change password for ${Email}`,
      });
      return;
    }
    const user = await Users.findOne({ Username: Email });
    if (user.Password === Password) {
      return res
        .status(401)
        .json({ message: `Password and new Password have to difference` });
    }
    if (user.IsActive === true) {
      res
        .status(404)
        .json({ message: `You have already changed password for first login` });
      return;
    }
    user.Password = Password;
    user.IsActive = true;
    user.FirstLogin = false;
    await user.save();
    user.Password = undefined;
    token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.cookie("token", token, { maxAge: timeToken });
    res.status(200).json({ message: "Changed password successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePasswordById = async (req, res) => {
  const id = req.user.data.id;
  const { Password, newPassword } = req.body;
  try {
    const user = await Users.findOne({ _id: id, Password });
    if (!user) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    user.Password = newPassword;
    await user.save();
    user.Password = undefined;
    const token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.cookie("token", token, { maxAge: timeToken });
    res.status(200).json({ message: "Changed password successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLock = async (req, res) => {
  const id = req.params.id || req.body.id || req.query.id;
  try {
    // Fetch the current user without updating
    const currentUser = await Users.findById(id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the lock status
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { IsLocked: !currentUser.IsLocked },
      { new: true }
    );

    // Sign a new token with updated user data
    const token = jwt.sign({ data: updatedUser }, SECRET_key, { expiresIn });

    // Set the new token in cookie
    res.cookie("token", token, { maxAge: timeToken });

    // Respond with appropriate message
    const lockStatus = updatedUser.IsLocked ? "locked" : "unlocked";
    res
      .status(200)
      .json({ message: `Employee ${updatedUser.Email} is ${lockStatus}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getImageByUser = async (req, res) => {
    const id = req.user.data.id;
    try {
        const user = await Users.findById(id);
        res.status(200).json(user.Profile_Picture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  login,
  upLoadAvatar,
  logout_removeCookie,
  changePasswordByEmail,
  changePasswordById,
  resendEmail,
  toggleLock,
  getImageByUser
};
