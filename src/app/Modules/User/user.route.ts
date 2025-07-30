import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controller";
import { createZodSchema } from "./user.validation";
const router = Router();
router.post(
  "/register",
  validateRequest(createZodSchema),
  UserControllers.createUser
);
router.get("/all-users", UserControllers.getAllUsers);

export const UserRoutes = router;
