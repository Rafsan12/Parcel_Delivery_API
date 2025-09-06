import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { ReceiverController } from "./receiver.controller";
const router = express.Router();

router.post(
  "/",
  checkAuth(Role.RECEIVER),
  ReceiverController.receiverTotalParcel
);
router.patch(
  "/:parcelId/delivered",
  checkAuth(Role.RECEIVER, Role.SUPER_ADMIN),
  ReceiverController.parcelDelivered
);

export const ReceiverRoutes = router;
