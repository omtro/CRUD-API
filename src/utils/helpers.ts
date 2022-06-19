
import { IncomingMessage } from "http";

import { validate as uuidValidate, version as uuidVersion } from "uuid";

export const uuidValidateV4 = (uuid) =>
  uuidValidate(uuid) && uuidVersion(uuid) === 4;

export const getReqBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(body));
    } catch (error) {
      reject(error);
    }
  });
};
