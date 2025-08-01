import { z } from "zod";

export const createParcelSchema = z.object({
  customerName: z
    .string({ message: "Customer name is required" })
    .min(2, { message: "Customer name must be at least 2 characters." }),

  customerPhone: z
    .string({ message: "Customer phone is required" })
    .min(10, { message: "Phone must be at least 10 characters." }),

  deliveryAddress: z.string({
    message: "Delivery address is required",
  }),

  deliveryArea: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"], {
    message: "Delivery area is required",
  }),

  weight: z.number({ message: "Weight is required" }).positive(),

  price: z.number().optional(),
});

export const updateParcelStatusSchema = z.object({
  status: z.enum(
    ["PENDING", "PICKED", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
    {
      message: "Status must be a valid enum value",
    }
  ),
});
