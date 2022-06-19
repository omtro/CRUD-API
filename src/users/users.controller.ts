import { IncomingMessage, ServerResponse } from "http";
import { BaseUser } from "../users/user.interface";

import {
  findAllUsers,
  createUser,
  findUser,
  updateUser,
  deleteUser,
} from "../users/users.service";
import { getReqBody, uuidValidateV4 } from "../utils/helpers";

export const controller = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url.startsWith("/api/users")) {
      const userId = req.url.split("/")[3];
      switch (req.method) {
        case "GET":
          if (userId) {
            if (uuidValidateV4(userId)) {
              const user = findUser(userId);
              if (user) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(user));
                res.end();
              } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(
                  JSON.stringify({ error: "User not found, check userId" })
                );
                res.end();
              }
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.write(JSON.stringify({ error: "Invalid userId" }));
              res.end();
            }
          } else if (req.url.startsWith("/api/users/") || req.url === "/api/users") {
            const users = findAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(users));
            res.end();
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("This route not found");
          }
          break;
        case "POST":
          const postBody: any = await getReqBody(req);
          const user: BaseUser = JSON.parse(postBody);
          if (user.username && user.age && Array.isArray(user.hobbies)) {
            const newUser = await createUser(user);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.write(JSON.stringify(newUser));
            res.end();
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(
              JSON.stringify({
                error: "Req body doesn't contain required fields",
              })
            );
            res.end();
          }
          break;
        case "PUT":
          if (uuidValidateV4(userId)) {
            const postBody: any = await getReqBody(req);
            const user: BaseUser = JSON.parse(postBody);
            if (user.username && user.age && Array.isArray(user.hobbies)) {
              try {
                const updatedUser = await updateUser(userId, user);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(updatedUser));
                res.end();
              } catch (error) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ error: error.message }));
                res.end();
              }
            } else {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify({
                  error: "Req body doesn't contain required fields",
                })
              );
              res.end();
            }
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ error: "Invalid userId" }));
            res.end();
          }
          break;
        case "DELETE":
          if (uuidValidateV4(userId)) {
            try {
              const deletedUser = await deleteUser(userId);
              res.writeHead(204, { "Content-Type": "application/json" });
              res.write(JSON.stringify(deletedUser));
              res.end();
            } catch (error) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.write(JSON.stringify({ error: error.message }));
              res.end();
            }
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ error: "Invalid userId" }));
            res.end();
          }
          break;
        default:
          res.writeHead(405, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ error: "Method not allowed" }));
          res.end();
          break;
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("This route not found");
    }
  } catch {
    res.statusCode = 500;
    res.write("Internal Server Error");
    res.end();
  }
};
