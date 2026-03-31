import express from "express";
import type { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import type { User } from "./types/User.ts";

const PORT: number = 3000;
const REACT_APP_ORIGIN = "http://localhost:5173";
const SALT_ROUNDS = 10;
const JWT_SECRET = "your_super_secret_key_123";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(
  cors({
    origin: REACT_APP_ORIGIN,
    credentials: true,
  }),
);

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
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add the decoded user data to the request object so routes can use it
    (req as any).user = decoded;

    next(); // Token is valid, proceed to the route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// --- Database Setup ---
let db: Database;

(async () => {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            name TEXT,
            surname TEXT,
            email TEXT UNIQUE,
            password TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
  console.log("Database initialized.");
})();

// --- Authentication Routes ---

// REGISTER: Validates input, hashes password, and saves user
app.post("/auth/register", async (req: Request, res: Response) => {
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
app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
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
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

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

// --- User Management Routes ---

app.get("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await db.all<User[]>(
      "SELECT id, username, name, surname, email, createdAt FROM users",
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch users." });
  }
});

// UPDATE: Updates a user's username, name and surname by ID
app.put(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, name, surname } = req.body;

    try {
      const result = await db.run(
        "UPDATE users SET username = ?, name = ?, surname = ? WHERE id = ?",
        [username, name, surname, id],
      );

      if (result.changes === 0) {
        return res
          .status(404)
          .json({ error: "User not found or no changes made." });
      }
      res.json({ message: "User updated successfully." });
    } catch (error) {
      res.status(500).json({ error: "Update failed." });
    }
  },
);

// DELETE: Deletes a user by ID
app.delete(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await db.run("DELETE FROM users WHERE id = ?", [id]);
      if (result.changes === 0) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json({ message: `User with ID ${id} deleted.` });
    } catch (error) {
      res.status(500).json({ error: "Delete failed." });
    }
  },
);

app.listen(PORT, () =>
  console.log(`\nNode-Server running at http://localhost:${PORT}\n`),
);
