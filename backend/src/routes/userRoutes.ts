import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Database } from "sqlite";
import type { User } from "../types/User.ts";

export const createUserRouter = (db: Database) => {
  const router = express.Router();

  // GET: Returns a list of all users
  router.get("/", async (req, res) => {
    // Path is "/" because in index.ts "/users" will be before that
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
      res.json({ message: "User updated successfully." });
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
