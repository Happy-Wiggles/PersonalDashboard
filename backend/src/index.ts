import "dotenv/config";
import express from "express";
import prisma from "./lib/prisma.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
  authorizeAdmin,
  authenticateToken,
} from "./middlewares/authMiddleware.js";
import { createTodoRouter } from "./routes/todoRoutes.js";
import { createAuthRouter } from "./routes/authRoutes.js";
import { createUserRouter } from "./routes/userRoutes.js";
import { createContactRouter } from "./routes/contactRoutes.js";

const REACT_APP_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [REACT_APP_ORIGIN, "http://localhost:4173"];

// --- Rate Limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 5 requests per windowMs
  message: "Zu viele Login/Register-Versuche. Bitte später versuchen.",
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  message: "Zu viele Login/Register-Versuche. Bitte später versuchen.",
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

// --- Middleware ---
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Routes Setup
(async () => {
  try {
    // Test connection
    await prisma.$connect();
    console.log("Database connected successfully via Prisma");

    // Use route file authRoutes.ts at "/auth"
    app.use("/auth", authLimiter, createAuthRouter());

    // Use route file usersRoutes.ts at "/users"
    app.use("/users", authenticateToken, authorizeAdmin, createUserRouter());

    // Use route file todoRoutes.ts at "/todos"
    app.use("/todos", authenticateToken, createTodoRouter());

    // Use route file contactRoutes.ts at "/contact"
    app.use("/contact", contactLimiter, createContactRouter());

    app.listen(PORT, () => {
      console.log(`\nNode-Server running at http://localhost:${PORT}\n`);
      startUptimeCounter();
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
})();

// --- Uptime Display ---
function startUptimeCounter() {
  const startTime = Date.now();
  setInterval(() => {
    const uptimeMs = Date.now() - startTime;
    const hours = Math.floor(uptimeMs / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    const seconds = Math.floor((uptimeMs % 60000) / 1000);
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    process.stdout.write(`\r[Server Status] Running since: ${timeString}`);
  }, 1000);
}
