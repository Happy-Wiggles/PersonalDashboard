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
const PORT = Number.parseInt(process.env.PORT || "3000");

// --- Rate Limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: "Zu viele Login/Register-Versuche. Bitte später versuchen.",
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  message:
    "Zu viele Kontakt-Versuche, das macht man nicht! Bitte versuche es später nochmal.",
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

// Trust Proxy: Tell express to trust Vercel-Proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

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
const authRouter = createAuthRouter();
const userRouter = createUserRouter();
const todoRouter = createTodoRouter();
const contactRouter = createContactRouter();

// Use route file authRoutes.ts at "/auth"
app.use(`/auth`, authLimiter, authRouter);
app.use(`/api/auth`, authLimiter, authRouter);

// Use route file usersRoutes.ts at "/users"
app.use(`/users`, authenticateToken, authorizeAdmin, userRouter);
app.use(`/api/users`, authenticateToken, authorizeAdmin, userRouter);

// Use route file todoRoutes.ts at "/todos"
app.use(`/todos`, authenticateToken, todoRouter);
app.use(`/api/todos`, authenticateToken, todoRouter);

// Use route file contactRoutes.ts at "/contact"
app.use(`/contact`, authenticateToken, contactLimiter, contactRouter);
app.use(`/api/contact`, authenticateToken, contactLimiter, contactRouter);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\nNode-Server running at http://localhost:${PORT}\n`);
    startUptimeCounter();
  });
}

// Global 404 handler
app.use((req, res) => {
  console.log(`Not found request: ${req.method} ${req.url}`);
  res.status(404).send(`Express could not find the path: ${req.url}`);
});

// Test prisma DB connection
prisma
  .$connect()
  .then(() => console.log("Database connected successfully via Prisma"))
  .catch((err) => console.error("Prisma connection error:", err));

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

// Important for Vercel (because the backend is being launched serverless/function-only)
export default app;
