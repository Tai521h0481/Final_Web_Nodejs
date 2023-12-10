const express = require('express');
const usersRouter = express.Router();
require('dotenv').config();

const {Users} = require('../models');
const {createUser, getAllUsers, getUserById, login, getProfile,
     upLoadAvatar, changePasswordByEmail, changePasswordById, resendEmail
    , toggleLock, getImageByUser, passwordRecovery, logout} = require('../controllers/users.controller');
const {uploadAvatar} = require('../middlewares/upload/uploadImage');
const {isCreated, isExistId, validateInput, isExistEmail, isActive, checkIsNewEmployee} = require('../middlewares/validations/validation');
const {authentication} = require('../middlewares/authentication/authentication');
const {authorization} = require('../middlewares/authorization/authorization');

// Đăng nhập vào hệ thống. (đã test)
usersRouter.post('/login', checkIsNewEmployee, login);
// Đổi mật khẩu cho employee mới không cần password cũ (đã test)
usersRouter.patch('/employees/firstChangePassword', validateInput(['Password']), isExistEmail(Users), changePasswordByEmail);
// Xem thông tin hồ sơ của người dùng hiện tại. (đã test)
usersRouter.get('/profiles', authentication, isActive, getProfile);
//Cập nhật password của người dùng hiện tại. (đã test)
usersRouter.patch('/profiles/changePassword',authentication, isActive, validateInput(['Password', 'newPassword']), changePasswordById);
//Cập nhật avatar của người dùng hiện tại (nhận từ body dạng formData) (đã test)
usersRouter.patch('/profiles/avatars', authentication, isActive, upLoadAvatar);
// Tạo một tài khoản mới (chỉ dành cho quản trị viên). (đã test)
usersRouter.post('/register', authentication, authorization(["admin"]), validateInput(['Fullname', 'Email']) , isCreated(Users), createUser);
// Lấy danh sách tất cả người dùng (chỉ dành cho quản trị viên). (đã test)
usersRouter.get('/',authentication, authorization(["admin"]), getAllUsers);
// Lấy người dùng theo id (chỉ dành cho quản trị viên). (đã test)
usersRouter.get('/:id', authentication, authorization(["admin"]), isExistId(Users), getUserById);
// send lại link login cho employee (salesperson) cần truyền Email vào body (đã test)
usersRouter.post('/resendEmail/:id', authentication, authorization(["admin"]), resendEmail);
// Mở hoặc khóa tài khoản của người dùng (chỉ dành cho quản trị viên). (đã test)
usersRouter.patch('/lock/:id', authentication, authorization(["admin"]), isExistId(Users), toggleLock);

// logout
usersRouter.post("/logout", authentication, logout);

usersRouter.get('/avatar/getAvatar', authentication, getImageByUser);
// 
usersRouter.post('/recover-password/:Email', passwordRecovery);

module.exports = usersRouter;