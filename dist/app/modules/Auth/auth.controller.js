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
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.NODE_ENV === 'development',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in succesfully!',
        data: {
            accessToken,
        },
    });
}));
// const changePassword = catchAsync(async (req, res) => {
//   const { ...passwordData } = req.body;
//   const result = await AuthServices.changePassword(req.user, passwordData);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password is updated succesfully!',
//     data: result,
//   });
// });
// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies;
//   const result = await AuthServices.refreshToken(refreshToken);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token is retrieved succesfully!',
//     data: result,
//   });
// });
// const forgetPassword = catchAsync(async (req, res) => {
//   const email = req.body.email;
//   const result = await AuthServices.forgetPassword(email);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Reset link is generated succesfully!',
//     data: result,
//   });
// });
// const resetPassword = catchAsync(async (req, res) => {
//   const { token, newPassword } = req.body;
//   if (!token) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Reset token is required!');
//   }
//   const result = await AuthServices.resetPassword(token, newPassword);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password reset succesfully!',
//     data: result,
//   });
// });
exports.AuthControllers = {
    loginUser,
};
