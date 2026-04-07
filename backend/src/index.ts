import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createTodoRouter } from "./routes/todoRoutes.js";
import { createAuthRouter } from "./routes/authRoutes.js";
import { createUserRouter } from "./routes/userRoutes.js";

const REACT_APP_ORIGIN = "http://localhost:5173";

const PORT = Number.parseInt(process.env.PORT || "3000");
const JWT_Secret = process.env.JWT_SECRET!; // The "!" tells TS that the variable exists and the value wont be null or undefined
const REFRESH_Secret = process.env.REFRESH_TOKEN_SECRET!;

if (!JWT_Secret || !REFRESH_Secret) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in .env file.",
  );
}

const app = express();

// --- Middleware ---
app.use(cookieParser());
app.use(
  cors({
    origin: REACT_APP_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

// --- Middleware to protect routes ---
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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

// --- Database Setup ---
let db: Database;

(async () => {
  try {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    // Activate foreign_keys so that "ON DELETE CASCADE" actually works
    await db.get("PRAGMA foreign_keys = ON");

    // Check if user table exists if not, create it
    const userTableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    );

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            name TEXT,
            surname TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT CHECK(role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    if (!userTableExists) {
      console.log(
        "Database initialized: Table 'users' was created for the first time.",
      );
    }

    // Check if todo_lists table exists if not, create it
    const todoListsTableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='todo_lists'",
    );

    await db.exec(`
        CREATE TABLE IF NOT EXISTS todo_lists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          title TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);

    if (!todoListsTableExists) {
      console.log(
        "Database initialized: Table 'todo_lists' was created for the first time.",
      );
    }

    // Check if todo_lists table exists if not, create it
    const todosTableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='todos'",
    );

    await db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          listId INTEGER,
          task TEXT NOT NULL,
          priority INTEGER DEFAULT 1,
          completed BOOLEAN DEFAULT 0,
          FOREIGN KEY (listId) REFERENCES todo_lists(id) ON DELETE CASCADE
       )
    `);

    if (!todosTableExists) {
      console.log(
        "Database initialized: Table 'todos' was created for the first time.",
      );
    }

    // Use route file authRoutes.ts at "/auth"
    app.use("/auth", createAuthRouter(db));

    // Use route file usersRoutes.ts at "/users"
    app.use("/users", authenticateToken, authorizeAdmin, createUserRouter(db));

    // Use route file todoRoutes.ts at "/todos"
    app.use("/todos", authenticateToken, createTodoRouter(db));

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
