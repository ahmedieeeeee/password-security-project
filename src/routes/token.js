import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function signAuthToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "30m" }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
