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
let linkLogin = `${BASE_URL}${pageChangePassword}`;

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

const getProfile = async (req, res) => {
  const id = req.user.data.id;
  try {
    const user = await Users.findById(id).select("-Password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendEmail = (Email, Title, Content) => {
  let mailOptions = {
    from: userMail,
    to: Email,
    subject: Title,
    text : Content,
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
  const id = req.params.id || req.body.id || req.query.id;
  let Email;
  let user;
  try {
    user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Email = user.Email;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  let responseSent = false;
  try {
    Email = Email.toLowerCase();
    const token = jwt.sign({ Email }, SECRET_key, { expiresIn : "1m" }); // Token expires in 1 minute
    const Title = "Welcome to Our App";
    const Login = linkLogin + `?token=${token}`;
    const Content = `Please click the link to login: ${Login}`;
    const message = await sendEmail(Email, Title, Content).catch((error) => {
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
    Email = Email.toLowerCase();
    const token = jwt.sign({ Email }, SECRET_key, { expiresIn:"1m" }); // Token expires in 1 minute
    const Title = "Welcome to Our App";
    const Login = linkLogin + `?token=${token}`;
    const Content = `Please click the link to login: ${Login}`;
    const message = await sendEmail(Email, Title, Content).catch((error) => {
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
      { new: true }
    )
      .select("-Password")
      .populate("Orders");
    if (!user) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }
    else if(user.IsLocked === true) {
      return res.status(401).json({ message: "Your account has been locked" });
    }
    user.IsOnline = true;
    await user.save();
    const token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.cookie("token", token, { maxAge: timeToken });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upLoadAvatar = async (req, res) => {
  const id = req.user.data.id;
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


const changePasswordByEmail = async (req, res) => {
  let Email = req.body.Email || req.query.Email || req.params.Email;
  const { Password } = req.body;
  try {
    Email = Email.toLowerCase();
    const user = await Users.findOne({ Email });
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
    user.IsOnline = true;
    await user.save();
    user.Password = undefined;
    token = jwt.sign({ data: user }, SECRET_key, { expiresIn });
    res.status(200).json({ message: "Changed password successfully", token , user});
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

const passwordRecovery = async (req, res) => {
  let Email = req.body.Email || req.query.Email || req.params.Email;
  try {
    const user = await Users.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    Email = Email.toLowerCase();
    const Title = "Password Recovery";
    const Content = `Your password is: ${user.Password}`;
    const message = await sendEmail(Email, Title, Content);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const logout = async (req, res) => {
  const id = req.user.data.id;
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { IsOnline: false },
      { new: true }
    );
    res.status(200).json({ message: "Logout successfully" });
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
  changePasswordByEmail,
  changePasswordById,
  resendEmail,
  toggleLock,
  getImageByUser,
  getProfile,
  passwordRecovery,
  logout
};
