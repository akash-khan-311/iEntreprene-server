import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export type TName = {
  firstName: string;
  lastName: string;
}
export type TJwtPayload = {
 email: string;
  role: string;
  name?: TName;
  image?: string;
  status?: string;
  profileImg?: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
