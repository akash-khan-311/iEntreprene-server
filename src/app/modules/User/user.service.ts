/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_ROLE } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createUserIntoDB = async (file: any, payload: Partial<TUser>) => {
  const userData: Partial<TUser> = { ...payload };

  // Set defaults if not provided
  userData.role = userData.role || USER_ROLE.user;
  userData.status = userData.status || 'active';
  userData.isDeleted = userData.isDeleted ?? false;
  



  // Handle profile image upload
  if (file && file.path) {
    const imageName = `${userData.email}_${userData?.name?.firstName}`;
    const { secure_url } = await sendImageToCloudinary(imageName, file.path);
    userData.profileImg = secure_url as string;
  }

  // Hash password
  if (userData.password) {
    userData.password = await bcrypt.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  const user = await User.create(userData);
  return user;
};

export const UserServices = {
  createUserIntoDB,
};
