import { Router } from "express";
import { UserRoutes } from "../Modules/User/user.route";
import { AuthRouter } from "../Modules/auths/auth.route";
import { ParcelRouter } from "../Modules/parcel/parcel.route";
import { ReceiverRoutes } from "../Modules/receiver/receiver.route";
import { SenderRouter } from "../Modules/sender/sender.route";

export const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/parcel",
    route: ParcelRouter,
  },
  {
    path: "/sender",
    route: SenderRouter,
  },
  {
    path: "/receiver",
    route: ReceiverRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
