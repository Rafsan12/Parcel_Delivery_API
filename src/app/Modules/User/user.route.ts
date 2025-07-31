import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import { checkAuth } from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createZodSchema, updateZodSchema } from "./user.validation";
const router = Router();
router.post(
  "/register",
  validateRequest(createZodSchema),
  UserControllers.createUser
);

router.patch(
  "/:id",
  validateRequest(updateZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

export const UserRoutes = router;
