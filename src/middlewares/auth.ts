import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access Denied, no token found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (typeof decoded !== "object" && !("id" in decoded)) {
      res.status(401).json({ message: "Access Denied, invalid token" });
      return;
    }
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", err.message);
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
