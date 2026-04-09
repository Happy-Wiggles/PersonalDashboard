import express from "express";
import { Database } from "sqlite";
import type { ToDoListItem } from "../types/ToDoListItem.js";
import type { ToDoItem } from "../types/ToDoItem.js";

// Wir exportieren eine Funktion, die die DB-Instanz annimmt
export const createTodoRouter = (db: Database) => {
  const router = express.Router();

  // --- TODOLISTS ---

  // Route: Get all lists from a user
  router.get("/lists", async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const lists = await db.all("SELECT * FROM todo_lists WHERE userId = ?", [
        userId,
      ]);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Laden der Listen" });
    }
  });

  // Route: Create a new list
  router.post("/lists", async (req: any, res) => {
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ error: "Titel ist erforderlich" });
    }

    try {
      const result = await db.run(
        "INSERT INTO todo_lists (userId, title) VALUES (?, ?)",
        [userId, title],
      );
      res.status(201).json({ id: result.lastID, title });
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Erstellen der Liste" });
    }
  });

  // Route: Update a ToDoList
  router.put("/lists/:id", async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
      const result = await db.run(
        "UPDATE todo_lists SET title = ? WHERE id = ?",
        [title, id],
      );

      if (result.changes === 0) {
        return res
          .status(404)
          .json({ error: "ToDo_List not found or no changes made." });
      }
      res.json({ message: "ToDo_List updated successfully." });
    } catch (error) {
      res.status(500).json({ error: "Update failed." });
    }
  });

  // Route: Delete a ToDoList
  router.delete("/lists/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.run("DELETE FROM todo_lists WHERE id = ?", [id]);

      if (result.changes === 0) {
        return res.status(404).json({ error: "todo_lists not found." });
      }

      res.json({
        message: `ToDo list with ID ${id} and all ToDos have been deleted.`,
      });
    } catch (error) {
      res.status(500).json({ error: "Deletion of todo_list failed." });
    }
  });

  // --- TODOs within a TODOLIST ---

  // Get all ToDos from a ToDoList
  router.get("/lists/:listId/todos", async (req, res) => {
    const { listId } = req.params;
    try {
      const tasks = await db.all<ToDoItem[]>(
        "SELECT * FROM todos WHERE listId = ?",
        [listId],
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error while loading the ToDos" });
    }
  });

  // Get all ToDos from all ToDoLists of a user
  router.get("/user/todos", async (req: any, res) => {
    const userId = req.user.userId;
    try {
      const tasks = await db.all<ToDoItem[]>(
        "SELECT * FROM todos WHERE listId IN (SELECT id FROM todo_lists WHERE userId = ?)",
        [userId],
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error while loading the ToDos" });
    }
  });

  // Add a new ToDo to a ToDoList
  router.post("/lists/:listId/todos", async (req, res) => {
    const { listId } = req.params;
    const { task, priority } = req.body;

    try {
      const result = await db.run(
        "INSERT INTO todos (listId, task, priority) VALUES (?, ?, ?)",
        [listId, task, priority || 1],
      );
      res.status(201).json({
        id: result.lastID,
        listId: Number(listId),
        task,
        priority: priority || 1,
        completed: false,
      });
    } catch (error) {
      res.status(500).json({ error: "ToDo could not be created." });
    }
  });

  // Mark a ToDo as done or change the priority
  router.put("/items/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { completed, priority } = req.body;

    try {
      // Using COALESCE, to only update the values that have been sent
      await db.run(
        "UPDATE todos SET completed = COALESCE(?, completed), priority = COALESCE(?, priority) WHERE id = ?",
        [completed, priority, todoId],
      );
      res.json({ message: "Task updated" });
    } catch (error) {
      res.status(500).json({ error: "Update did not work." });
    }
  });

  // Delete a todo
  router.delete("/items/:todoId", async (req, res) => {
    const { todoId } = req.params;
    await db.run("DELETE FROM todos WHERE id = ?", [todoId]);
    res.json({ message: "Task deleted" });
  });

  return router;
};
