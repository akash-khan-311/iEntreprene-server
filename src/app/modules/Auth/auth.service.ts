/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';
import {
  TChangePasswordPayload,
  TLoginUser,
  TSignUpUser,
} from './auth.interface';
import { TJwtPayload, createToken, verifyToken } from './auth.utils';

const signUpUser = async (payload: TSignUpUser): Promise<TUser> => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);
  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already taken!');
  }
  const newUser = await User.create(payload);
  return newUser;
};

const loginUser = async (payload: TLoginUser) => {
  // Always select password for login
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid credentials');
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials');
  }

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role || '',
    profileImg: user.profileImg,
    status: user.status,
    name: {
      firstName: user.name.firstName,
      lastName: user.name.lastName,
    },
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: TJwtPayload,
  payload: TChangePasswordPayload,
) => {
  const user = await User.findOne({ email: userData.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (
    !user.password ||
    !(await User.isPasswordMatched(
      payload.currentPassword || '',
      user.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect current password');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    { email: userData.email },
    { password: newHashedPassword, passwordChangedAt: new Date() },
    { new: true, runValidators: true },
  );

  return { message: 'Password changed successfully!' };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { email } = decoded;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role || '',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const jwtPayload: TJwtPayload = {
    email: user.email,
    role: user.role || '',
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?token=${resetToken}`;
  await sendEmail(user.email, `Password Reset Link: ${resetUILink}`);

  return { message: 'Password reset link sent to your email.' };
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = verifyToken(token, config.jwt_access_secret as string);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Invalid reset token or user not found.',
      );
    }

    const newHashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
      { email },
      { password: newHashedPassword, passwordChangedAt: new Date() },
    );

    return { message: 'Password reset successfully!' };
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid reset token.');
  }
};

export const AuthServices = {
  signUpUser,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
