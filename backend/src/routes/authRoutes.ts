import express from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

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

// Generates hashed verification token
const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  return { rawToken, hashedToken, expiresAt };
};

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

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return res.status(400).json({ error: "Ungültige Eingabedaten." });
      }

      if (password.length < 8 || password.length > 72) {
        return res
          .status(400)
          .json({
            error: "Das Passwort muss zwischen 8 und 72 Zeichen lang sein.",
          });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Generate token
      const { rawToken, hashedToken, expiresAt } = generateVerificationToken();

      // Create the user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          name,
          surname,
          role: "user", // Default role
          isVerified: false,
          verificationToken: hashedToken,
          verificationTokenExpires: expiresAt,
        },
      });

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&userId=${newUser.id}`;
      // TODO: Actually send E-Mail with verificationUrl
      // await sendVerificationEmail(newUser.email, verificationUrl);

      // Response (with partial user data)
      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res
          .status(409)
          .json({ error: "Username or Email already exists." });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- VERIFY EMAIL ROUTE ---
  router.post("/verify-email", async (req: Request, res: Response) => {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({ error: "Token and userId are required." });
    }

    try {
      const hashedIncomingToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid request." });
      }

      if (user.isVerified) {
        return res.status(200).json({ message: "Email is already verified." });
      }

      const isTokenValid =
        user.verificationToken &&
        crypto.timingSafeEqual(
          Buffer.from(user.verificationToken),
          Buffer.from(hashedIncomingToken),
        );

      const isNotExpired = user.verificationTokenExpires
        ? new Date(user.verificationTokenExpires) > new Date()
        : false;

      if (!isTokenValid || !isNotExpired) {
        return res.status(400).json({
          error: "Verification link is invalid or has expired.",
        });
      }

      // Verify User and delete tokens
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        },
      });

      res
        .status(200)
        .json({ message: "Email successfully verified. You can now log in." });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // --- RESEND VERIFICATION ROUTE ---
  router.post("/resend-verification", async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || user.isVerified) {
        return res.status(200).json({
          message:
            "If the email exists and is unverified, a new link has been sent.",
        });
      }

      const { rawToken, hashedToken, expiresAt } = generateVerificationToken();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: hashedToken,
          verificationTokenExpires: expiresAt,
        },
      });

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&userId=${user.id}`;
      // await sendVerificationEmail(user.email, verificationUrl);

      res.status(200).json({
        message:
          "If the email exists and is unverified, a new link has been sent.",
      });
    } catch (error) {
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

      // Check if user is verified
      // TODO: Uncomment once email verification is set up
      // if (!user.isVerified) {
      //   return res.status(403).json({
      //     error: "Please verify your email address before logging in.",
      //     isUnverified: true, // Could later be used for the frontend to lead the user to a resend button
      //   });
      // }

      // Generate JWT access token (Short-Time: 15min)
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        JWT_Secret,
        { expiresIn: "15m" },
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

      // Check if user does exist in the system and is verified
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      // TODO: Add  || !user.isVerified as soon as email verification is set up
      if (!user) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        return res
          .status(403)
          .json({ error: "User unauthorized or unverified." });
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role, email: decoded.email },
        JWT_Secret,
        { expiresIn: "15m" },
      );

      res.json({ token: accessToken });
    } catch (error) {
      // If the refresh token is expired or not valid
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      res
        .status(403)
        .json({ error: "Invalid refresh token. Please login again." });
    }
  });

  // --- LOGOUT ROUTE ---
  router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out successfully." });
  });

  return router;
};
