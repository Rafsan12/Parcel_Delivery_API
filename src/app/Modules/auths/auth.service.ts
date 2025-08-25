import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { envVas } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role,
  // };

  // const accessToken = generateToken(
  //   jwtPayload,
  //   envVas.JWT_ACCESS_SECRET,
  //   envVas.JWT_ACCESS_EXPIRES
  // );

  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVas.JWT_REFRESH_SECRET,
  //   envVas.JWT_REFRESH_EXPIRES
  // );

  const userToken = createUserTokens(isUserExist);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: UserPassword, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,

    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async(payload:Record<string,any>,decodedToken:JwtPayload)=>{
  if(payload.id !== decodedToken.userId){
    throw new AppError(httpStatus.BAD_REQUEST, "You can not reset your password")
  }

  const isUserExist = await User.findById(decodedToken.userId);

  if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST,"User does not exist")
  }

  const hashPassword = await bcryptjs.hash(payload.newPassword,Number(envVas.BCRYPT_SALT_ROUND));

  isUserExist.password = hashPassword;

  await isUserExist.save();
}

const changePassword = async(oldPassword:string, newPassword:string,decodedToken:JwtPayload)=>{
  const user = await User.findById(decodedToken.userId)

  const isOldPasswordMatch = await bcryptjs.compare(oldPassword,user!.password as string)
  if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword,Number(envVas.BCRYPT_SALT_ROUND))

    user!.save()
}

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
