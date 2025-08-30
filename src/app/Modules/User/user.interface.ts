import { Types } from "mongoose";

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  role: Role;
  isVerified?: boolean;
  auth: IAuthProvider[];
  isActive?: IsActive;
}
