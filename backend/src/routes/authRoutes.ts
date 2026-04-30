import express from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_Secret = process.env.JWT_SECRET!;
const REFRESH_Secret = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_Secret || !REFRESH_Secret) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET or REFRESH_Secret is not defined in .env file.",
  );
}

// Interface for JWT Payload to avoid 'any'
interface JwtPayload {
  userId: number;
  role: string;
  email: string;
}

export const createAuthRouter = () => {
  const router = express.Router();

  // --- REGISTER ROUTE ---
  // REGISTER: Validates input, hashes password, and saves user
  router.post("/register", async (req: Request, res: Response) => {
    const { username, email, password, name, surname } = req.body;

    // Basic Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Username or Email already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          name,
          surname,
          role: "user", // Default role
        },
      });

      // Generate Token
      const token = jwt.sign(
        {
          userId: newUser.id,
          role: newUser.role,
          email: newUser.email,
        },
        JWT_Secret,
        { expiresIn: "15min" },
      );

      // Response (with partial user data)
      res.status(201).json({
        message: "Registration successful.",
        token: token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ error: "Username or Email already exists." });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- LOGIN ROUTE ---
  // LOGIN: Compares hashed password and returns a JWT
  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      const isPasswordMatch = user
        ? await bcrypt.compare(password, user.password || "")
        : false;

      // Use a generic error message for both cases for security reasons
      if (!user || !isPasswordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Generate JWT access token (Short-Time: 15min)
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        JWT_Secret,
        { expiresIn: "15min" },
      );

      // Generate JWT refresh token (Long-Time: 7 days)
      const refreshToken = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        REFRESH_Secret,
        { expiresIn: "7d" },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Remove password from user object before sending response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: "Login successful.",
        token: accessToken,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- REFRESH ROUTE ---
  // The frontend will call it, when the access token is expired
  router.get("/refresh", async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.status(401).json({ error: "No refresh token provided." });
    }

    const refreshToken = cookies.refreshToken;

    try {
      // Verify the token using the JwtPayload interface
      const decoded = jwt.verify(refreshToken, REFRESH_Secret) as JwtPayload;

      // Generate a new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role, email: decoded.email },
        JWT_Secret,
        { expiresIn: "15m" },
      );

      res.json({ token: accessToken });
    } catch (error) {
      // If the refresh token is expired or not valid
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      res
        .status(403)
        .json({ error: "Invalid refresh token. Please login again." });
    }
  });

  // --- LOGOUT ROUTE ---
  router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.json({ message: "Logged out successfully." });
  });

  return router;
};
