import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config"

export function generateToken(payload: any): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return false;
  }
}
