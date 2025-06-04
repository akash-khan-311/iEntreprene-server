/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE, GENDER, BLOOD_GROUP, COUNTRY_LIST, CountryEnumType, UserRoleEnumType, BloodGroupEnumType, GenderEnumType } from './user.constant';

export interface TUser { 
  name: { firstName: string; lastName: string };
  email: string;
  password: string;
  country: CountryEnumType;
  gender: GenderEnumType;
  bloodGroup?: BloodGroupEnumType;
  designation?: string;
  role?: UserRoleEnumType;
  socialMedia?: { name: string; link: string }[]; 
  profileImg?: string;
  passwordChangedAt?: Date;
  status?: 'active' | 'blocked';
  isDeleted?: boolean;
}

export interface UserModel extends Model<TUser> {
  // Static method to find a user by their email
  isUserExistsByEmail(email: string): Promise<TUser>;
  // Instance method for checking if passwords match
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  // Instance method to check if a JWT was issued before a password change
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
export type TGender = keyof typeof GENDER;
export type TBloodGroup = keyof typeof BLOOD_GROUP;