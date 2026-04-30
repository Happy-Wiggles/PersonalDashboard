import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_Secret = process.env.JWT_SECRET!; // The "!" tells TS that the variable exists and the value wont be null or undefined
const REFRESH_Secret = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_Secret || !REFRESH_Secret) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in .env file.",
  );
}

// --- Middleware to protect routes ---
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from the "Authorization" header (Format: "Bearer TOKEN")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(token, JWT_Secret);

    // Add the decoded user data to the request object so routes can use it
    (req as any).user = decoded;

    next(); // Token is valid, proceed to the route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // req.user has been filled before by authenticateToken()
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      error: "Access denied. Admin privileges required.",
    });
  }

  next(); // Proceed if the user is admin
};
