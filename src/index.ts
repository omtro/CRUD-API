import * as dotenv from "dotenv";
import { IncomingMessage, ServerResponse, createServer } from "http";
import cluster from "cluster";
import { cpus } from "os";

dotenv.config();

import { controller } from "./users/users.controller";

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

if (!process.env.PORT) {
  process.exit(1);
}

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    controller(req, res);
  }
);

if (process.env.NODE_ENV === "cluster" && cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {
  server.listen(PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${PORT}`);
  });
}

