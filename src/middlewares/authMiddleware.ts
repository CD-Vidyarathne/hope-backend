import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Roles } from "../types/roles";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      req.user = {
        id: decoded.id as number,
        role: decoded.role as Roles,
      };
    }
    next();
  } catch (err) {
    res.status(403).json({ error: "Token is invalid" });
  }
};

export const authorize =
  (roles: Roles[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Roles)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    next();
  };
