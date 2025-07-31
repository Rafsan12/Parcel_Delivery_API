import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVas } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.model";

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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVas.JWT_ACCESS_SECRET,
    envVas.JWT_ACCESS_EXPIRED
  );
  return {
    accessToken,
  };
};

export const AuthService = {
  credentialsLogin,
};
