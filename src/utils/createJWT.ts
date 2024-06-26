import jsonwebtoken from "jsonwebtoken";
import { User } from "../interfaces/user";

export const createJWT = (user: User) => {
  const token = jsonwebtoken.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  return token;
}

export const verifyJWT = (token) => {
  return jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
}