import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Database } from "sqlite";
import type { User } from "../types/User.ts";

const SALT_ROUNDS = 10;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const JWT_Secret = process.env.JWT_SECRET!; // The "!" tells TS that the variable exists and the value wont be null or undefined
const REFRESH_Secret = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_Secret || !REFRESH_Secret) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET or REFRESH_Secret is not defined in .env file.",
  );
}

export const createAuthRouter = (db: Database) => {
  const router = express.Router();

  // --- REGISTER ROUTE ---
  // REGISTER: Validates input, hashes password, and saves user
  router.post("/register", async (req, res) => {
    const { username, email, password, name, surname } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password too weak. Requirements: 8+ chars, upper/lower, number, symbol.",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      await db.run(
        "INSERT INTO users (username, email, password, name, surname) VALUES (?, ?, ?, ?, ?)",
        [username, email, hashedPassword, name, surname],
      );

      res.status(201).json({ message: "Registration successful." });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return res
          .status(409)
          .json({ error: "Username or Email already exists." });
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- LOGIN ROUTE ---
  // LOGIN: Compares hashed password and returns a JWT
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    try {
      const user = await db.get<User>("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      // Check if user has been found and if password hashes match
      let isPasswordMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (!user || !isPasswordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Generate JWT access token (Short-Time: 15min)
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_Secret,
        {
          expiresIn: "15min",
        },
      );

      // Generate JWT refresh token (Long-Time: 7 days)
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        REFRESH_Secret,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Means JS can't read the cookie (XSS (Cross-Site-Scripting) protection)
        secure: false, // Must be set to 'true', if HTTPS is being used in production
        sameSite: "strict", // CSRF (Cross-Site Request Forgery) attack protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: "Login successful.",
        token: accessToken,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- REFRESH ROUTE ---
  // The frontend will call it, when the access token is expired
  router.get("/refresh", async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.status(401).json({ error: "No refresh token provided." });
    }

    const refreshToken = cookies.refreshToken;

    try {
      // Verify the token
      const decoded = jwt.verify(refreshToken, REFRESH_Secret) as any;

      // Generate a new token
      const accessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        JWT_Secret,
        {
          expiresIn: "15m",
        },
      );

      res.json({ token: accessToken });
    } catch (error) {
      // If the refresh token is expired or not valid
      res.clearCookie("refreshToken");
      res
        .status(403)
        .json({ error: "Invalid refresh token. Please login again." });
    }
  });

  // --- LOGOUT ROUTE ---
  router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.json({ message: "Logged out successfully." });
  });

  return router;
};
