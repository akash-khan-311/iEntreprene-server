import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import {
  BLOOD_GROUP,
  COUNTRY_LIST,
  GENDER,
  USER_ROLE,
  UserStatus,
} from './user.constant';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    country: { type: String, enum: COUNTRY_LIST, required: true },
    gender: { type: String, enum: GENDER, required: true },
    bloodGroup: { type: String, enum: BLOOD_GROUP },
    designation: { type: String },
    role: { type: String, enum: USER_ROLE, required: true },
    socialMedia: [{ name: String, link: String }],
    profileImg: { type: String },
    passwordChangedAt: { type: Date },
    status: {
      type: String,
      enum: UserStatus,
      default: 'active',
      required: true,
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);


// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  if (!passwordChangedTimestamp) return false;
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
