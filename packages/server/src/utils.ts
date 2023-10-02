import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config"

import { randomBytes } from "node:crypto";

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

export function parseToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}

export const parseAuthHeader = (auth: string): string | null => {
    const a = auth.split(" ");
    if (a.length !== 2) return null;
    if (a[0].toLowerCase() != "bearer") return null;
    return a?.pop() || null;
}


export function randomString(length: number): string {
    return randomBytes(length).toString("hex");
}
