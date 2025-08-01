import { Router } from "express";
import { UserRoutes } from "../Modules/User/user.route";
import { AuthRouter } from "../Modules/auths/auth.route";
import { ParcelRouter } from "../Modules/parcel/parcel.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
