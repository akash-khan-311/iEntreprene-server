import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
});


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
    },
  });
});

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

export const AuthControllers = {
  loginUser,
};
