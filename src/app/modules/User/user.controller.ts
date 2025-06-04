import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  

  const user = await UserServices.createUserIntoDB(req.file, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

// const getMe = catchAsync(async (req, res) => {
//   const { email } = req.user;
//   const user = await UserServices.getMe(email);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User profile fetched successfully',
//     data: user,
//   });
// });

// const changeStatus = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const { status } = req.body;
//   const user = await UserServices.changeStatusByEmail(email, status);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User status updated successfully',
//     data: user,
//   });
// });

export const UserControllers = {
  createUser,
 
};
