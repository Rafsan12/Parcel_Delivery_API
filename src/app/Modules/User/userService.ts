import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVas } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

// Create a new user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExit = await User.findOne({ email });

  if (isUserExit) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashPassword = await bcryptjs.hash(
    password as string,
    Number(envVas.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: authProvider,
    ...rest,
  });
  return user;
};

// Update user

const UpdateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExits = await User.findById(userId);
  if (!ifUserExits) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVas.BCRYPT_SALT_ROUND
    );
  }

  const newUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUser;
};

// Get All User
const getAllUsers = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};
export const UserServices = {
  createUser,
  getAllUsers,
  UpdateUser,
};
