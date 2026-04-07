import express from "express";
import { Database } from "sqlite";
import type { User } from "../types/User.ts";
import { authorizeAdmin } from "../index.js";

export const createUserRouter = (db: Database) => {
  const router = express.Router();

  // GET: Returns a list of all users
  router.get("/", authorizeAdmin, async (req, res) => {
    // Path is "/" because in index.ts "/users" will be placed before that
    try {
      const users = await db.all<User[]>(
        "SELECT id, username, name, surname, email, createdAt FROM users",
      );
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch users." });
    }
  });

  // GET: User by ID (the id comes from the JWT token in this case)
  router.get("/me", async (req, res) => {
    const userId = (req as any).user.userId;
    const user = await db.get<User>(
      "SELECT id, username, name, surname, email, createdAt FROM users WHERE id = ?",
      [userId],
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  });

  // UPDATE: Updates a user's username, name and surname by ID
  router.put("/:id", async (req, res) => {
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

      const updatedUser = await db.get<User>(
        "SELECT id, username, name, surname, email, createdAt FROM users WHERE id = ?",
        [id],
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Update failed." });
    }
  });

  // DELETE: Deletes a user by ID
  router.delete("/:id", async (req, res) => {
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
  });

  return router;
};
