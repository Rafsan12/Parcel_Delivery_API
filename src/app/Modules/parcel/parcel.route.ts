import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../User/user.interface";
import { ParcelController } from "./parcel.controller";
import {
  createParcelSchema,
  updateParcelStatusSchema,
} from "./parcel.validation";

const router = Router();

router.post(
  "/create-parcel",
  validateRequest(createParcelSchema),
  checkAuth(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.createParcel
);

router.patch(
  "/:id",
  validateRequest(updateParcelStatusSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER),
  ParcelController.updateParcelStatus
);

router.get("/:trackingId", ParcelController.parcelTracking);

export const ParcelRouter = router;
