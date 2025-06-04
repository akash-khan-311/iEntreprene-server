import { TUser } from './../User/user.interface';
export type TLoginUser = {
  email: string;
  password: string;
};

export type TRefreshTokenPayload = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

export type TChangePasswordPayload = {
  currentPassword?: string;
  newPassword: string;
};

export type TForgetPasswordPayload = {
  email: string;
};

export type TResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type TSignUpUser = Omit<TUser, 'status' | 'isDeleted' | 'passwordChangedAt' | 'profileImg'>;