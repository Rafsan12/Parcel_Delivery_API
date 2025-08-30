import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../User/user.model";

const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
  //6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sentOtp = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }
  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  sendEmail({
    to: email,
    subject: "Your OTP",
    templateName: "otp-email",
    templateData: {
      name,
      email,
      otp,
    },
  });
};
const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(401, "You are already verified");
  }
  const redisKey = `otp:${email}`;

  const saveOtp = await redisClient.get(redisKey);

  if (!saveOtp) {
    throw new AppError(401, "Invalid Opt");
  }
  if (saveOtp !== otp) {
    throw new AppError(401, "Invalid Opt");
  }
  await User.updateOne(
    { email },
    { isVerified: true },
    { runValidators: true }
  );

  await redisClient.del([redisKey]);
};

export const OtpService = {
  sentOtp,
  verifyOtp,
};
