const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

const {Users} = require('../models');
const {createUser, getAllUsers, getUserById, updateUser, login, logout_removeCookie, upLoadAvatar, changePasswordByEmail, changePasswordById, resendEmail} = require('../controllers/users.controller');
const {uploadImg} = require('../middlewares/upload/uploadImage');
const {isCreated, isExistId, validateInput} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');

// Đăng nhập vào hệ thống.
usersRouter.post('/login', login);
// Đổi mật khẩu cho employee mới không cần password
usersRouter.put('/employees/:Email', validateInput(['Password']), changePasswordByEmail);
//Đăng xuất khỏi hệ thống.
usersRouter.post('/logout', authentication, logout_removeCookie);
// Xem thông tin hồ sơ của người dùng hiện tại.
usersRouter.get('/profiles/:id', authentication, getUserById);
//Cập nhật password của người dùng hiện tại.
usersRouter.put('/profiles/changePassword/:id',authentication);
//Cập nhật avatar của người dùng hiện tại (nhận từ body dạng formData) (đã test)
usersRouter.put('/profiles/avatars/:id', authentication, uploadImg("avatars"), upLoadAvatar);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên).
usersRouter.post('/register', authentication, authorization(["admin"]), validateInput(['Fullname', 'Email']) ,isCreated(Users), createUser);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên).
usersRouter.get('/',authentication, authorization(["admin"]), getAllUsers);
// Lấy người dùng theo id (chỉ dành cho quản trị viên).
usersRouter.get('/:id', authentication, authorization(["admin"]), isExistId(Users), getUserById);
// send lại link login cho employee (salesperson) cần truyền Email vào body (đã test cần limit 1 phút)
usersRouter.post('/resendEmail', authentication, authorization(["admin"]), resendEmail);

module.exports = usersRouter;