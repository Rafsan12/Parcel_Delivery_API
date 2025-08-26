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
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

router.get("/:id", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  validateRequest(updateZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
