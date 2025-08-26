import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { ReceiverController } from "./receiver.controller";
const router = express.Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  ReceiverController.receiverTotalParcel
);

export const ReceiverRoutes = router;
