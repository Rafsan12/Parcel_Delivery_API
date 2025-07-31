import { envVas } from "./app/config/env";
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVas.DB_URL);
    console.log("connect to DB");
    server = app.listen(envVas.PORT, () => {
      console.log(`Server is listening to port ${envVas.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", () => {
  console.log("unhandled Rejection detected  server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("uncaught Exception detected  server shutting down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});
