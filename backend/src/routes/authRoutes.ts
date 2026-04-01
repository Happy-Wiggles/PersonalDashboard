import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Database } from "sqlite";
import type { User } from "../types/User.ts";

const SALT_ROUNDS = 10;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const JWT_Secret = process.env.JWT_SECRET!; // The "!" tells TS that the variable exists and the value wont be null or undefined

if (!JWT_Secret) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
}

export const createAuthRouter = (db: Database) => {
  const router = express.Router();

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

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!, // The "!" tells TS that the variable exists and the value wont be null or undefined
        {
          expiresIn: "1h",
        },
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Login successful.",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};
