"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../User/user.model");
const auth_utils_1 = require("./auth.utils");
const signUpUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Email is already taken!');
    }
    const newUser = yield user_model_1.User.create(payload);
    return newUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Always select password for login
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid credentials');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Invalid credentials');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role || '',
        profileImg: user.profileImg,
        status: user.status,
        name: {
            firstName: user.name.firstName,
            lastName: user.name.lastName,
        }
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userData.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (!user.password ||
        !(yield user_model_1.User.isPasswordMatched(payload.currentPassword || '', user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Incorrect current password');
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({ email: userData.email }, { password: newHashedPassword, passwordChangedAt: new Date() }, { new: true, runValidators: true });
    return { message: 'Password changed successfully!' };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role || '',
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role || '',
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '10m');
    const resetUILink = `${config_1.default.reset_pass_ui_link}?token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)(user.email, `Password Reset Link: ${resetUILink}`);
    return { message: 'Password reset link sent to your email.' };
});
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_access_secret);
        const email = decoded.email;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid reset token or user not found.');
        }
        const newHashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        yield user_model_1.User.findOneAndUpdate({ email }, { password: newHashedPassword, passwordChangedAt: new Date() });
        return { message: 'Password reset successfully!' };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid reset token.');
    }
});
exports.AuthServices = {
    signUpUser,
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
