/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import { envVas } from "../config/env";
import { IAuthProvider, IUser, Role } from "../Modules/User/user.interface";
import { User } from "../Modules/User/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVas.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVas.SUPER_ADMIN_PASSWORD,
      Number(envVas.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVas.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super admin",
      role: Role.SUPER_ADMIN,
      email: envVas.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      auth: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
