import z from "zod";

export const createZodSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),

  email: z
    .string({ message: "Email must be a string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),

  password: z
    .string({ message: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
    }),
});
