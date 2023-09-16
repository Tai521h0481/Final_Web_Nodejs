const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

const {Users} = require('../models');
const {createUser, getAllUsers, getUserById, updateUser, login, logout_removeCookie, upLoadAvatar, changePasswordByEmail, changePasswordById} = require('../controllers/users.controller');
const {isCreated, isExistId, validateInput} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authenticate/authentication');
const {authorization} = require('../middlewares/authorize/authorization');

// Đăng nhập vào hệ thống.
usersRouter.post('/login', login);
// Đổi mật khẩu cho employee mới không cần password
usersRouter.put('/newEmployee/:Email', validateInput(['Password']), changePasswordByEmail);
//Đăng xuất khỏi hệ thống.
usersRouter.post('/logout', authentication, logout_removeCookie);
// Xem thông tin hồ sơ của người dùng hiện tại.
usersRouter.get('/profile/:id', authentication, getUserById);
//Cập nhật password của người dùng hiện tại.
usersRouter.put('/profile/changePassword/:id',authentication);
//Cập nhật avatar của người dùng hiện tại.
usersRouter.put('/profile/avatar/:id',authentication, upLoadAvatar);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên).
usersRouter.post('/register', authentication, authorization(["admin"]), validateInput(['Fullname', 'Email']) ,isCreated(Users), createUser);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên).
usersRouter.get('/',authentication, authorization(["admin"]), getAllUsers);
// Lấy người dùng theo id (chỉ dành cho quản trị viên).
usersRouter.get('/:id', authentication, authorization(["admin"]), isExistId(Users), getUserById);
//Cập nhật thông tin của một người dùng cụ thể (chỉ dành cho quản trị viên).
// usersRouter.put(`/:id`, authentication, authorization(["admin"]), isExistId(Users), updateUser);

module.exports = usersRouter;