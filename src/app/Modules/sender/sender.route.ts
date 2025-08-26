import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { SenderControllers } from "./sender,controller";

const router = Router();

router.get(
  "/:id",
  checkAuth(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN),
  SenderControllers.getAllParcelCount
);

export const SenderRouter = router;
