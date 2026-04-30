import express from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

// Extended interface to include user data from JWT middleware
interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

export const createTodoRouter = () => {
  const router = express.Router();

  // Helper function to extract and validate userId from the request object
  const getUserId = (req: AuthenticatedRequest): number => {
    if (!req.user?.userId) throw new Error("Unauthorized");
    return req.user.userId;
  };

  // --- TODOLISTS ---

  // GET: Retrieve all lists belonging to the authenticated user
  router.get("/lists", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const lists = await prisma.todoList.findMany({
        where: { userId },
      });
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: "Failed to load lists" });
    }
  });

  // POST: Create a new ToDo list
  router.post("/lists", async (req: AuthenticatedRequest, res: Response) => {
    const { title } = req.body;
    try {
      const userId = getUserId(req);
      if (!title) return res.status(400).json({ error: "Title is required" });

      const newList = await prisma.todoList.create({
        data: { title, userId },
      });
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ error: "Failed to create list" });
    }
  });

  // PUT: Update a list title (with ownership check)
  router.put("/lists/:id", async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const userId = getUserId(req);

      // Using updateMany allows us to filter by userId to ensure ownership
      const updateStatus = await prisma.todoList.updateMany({
        where: {
          id: Number(id),
          userId: userId,
        },
        data: { title },
      });

      if (updateStatus.count === 0) {
        return res
          .status(403)
          .json({ error: "List not found or unauthorized" });
      }

      res.json({ message: "List updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  // DELETE: Remove a list and its todos (Cascade is handled by DB/Prisma schema)
  router.delete(
    "/lists/:id",
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      try {
        const userId = getUserId(req);

        // Verify ownership before deleting
        const list = await prisma.todoList.findFirst({
          where: { id: Number(id), userId },
        });

        if (!list) return res.status(403).json({ error: "Unauthorized" });

        await prisma.todoList.delete({ where: { id: Number(id) } });
        res.json({ message: "List deleted" });
      } catch (error) {
        res.status(500).json({ error: "Deletion failed" });
      }
    },
  );

  // --- TODOS ---

  // GET: All todos within a specific list
  router.get(
    "/lists/:listId/todos",
    async (req: AuthenticatedRequest, res: Response) => {
      const { listId } = req.params;
      try {
        const userId = getUserId(req);

        const todos = await prisma.todo.findMany({
          where: {
            listId: Number(listId),
            todo_list: { userId }, // Combined ownership check via relation
          },
        });
        res.json(todos);
      } catch (error) {
        res
          .status(500)
          .json({ error: `Failed to load todos of list with id: ${listId}` });
      }
    },
  );

  // POST: Create a new todo in a specific list
  router.post(
    "/lists/:listId/todos",
    async (req: AuthenticatedRequest, res: Response) => {
      const { listId } = req.params;
      const { task, priority } = req.body;
      try {
        const userId = getUserId(req);

        // Verify list ownership
        const list = await prisma.todoList.findFirst({
          where: { id: Number(listId), userId },
        });

        if (!list) return res.status(403).json({ error: "Unauthorized" });

        const newTodo = await prisma.todo.create({
          data: {
            listId: Number(listId),
            task,
            priority: priority || 1,
          },
        });
        res.status(201).json(newTodo);
      } catch (error) {
        res.status(500).json({ error: "Task creation failed" });
      }
    },
  );

  // PUT: Update todo status or priority
  router.put(
    "/items/:todoId",
    async (req: AuthenticatedRequest, res: Response) => {
      const { todoId } = req.params;
      const { completed, priority } = req.body;
      try {
        const userId = getUserId(req);

        // Check ownership via the related list
        const targetTodo = await prisma.todo.findFirst({
          where: { id: Number(todoId), todo_list: { userId } },
        });

        if (!targetTodo) return res.status(403).json({ error: "Unauthorized" });

        const updatedTodo = await prisma.todo.update({
          where: { id: Number(todoId) },
          data: {
            // If a value is undefined, Prisma leaves the existing DB value as is (COALESCE behavior)
            completed: completed !== undefined ? completed : undefined,
            priority: priority !== undefined ? priority : undefined,
          },
        });

        res.json(updatedTodo);
      } catch (error) {
        res.status(500).json({ error: "Task update failed" });
      }
    },
  );

  // DELETE: Remove a specific todo
  router.delete(
    "/items/:todoId",
    async (req: AuthenticatedRequest, res: Response) => {
      const { todoId } = req.params;
      try {
        const userId = getUserId(req);

        const targetTodo = await prisma.todo.findFirst({
          where: { id: Number(todoId), todo_list: { userId } },
        });

        if (!targetTodo) return res.status(403).json({ error: "Unauthorized" });

        await prisma.todo.delete({ where: { id: Number(todoId) } });
        res.json({ message: "Task deleted" });
      } catch (error) {
        res.status(500).json({ error: "Task deletion failed" });
      }
    },
  );

  // GET: All ToDos of the User not depending on the list (for Dashboard widget)
  router.get(
    "/user/todos",
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = getUserId(req);

        const todos = await prisma.todo.findMany({
          where: {
            todo_list: {
              userId: userId,
            },
          },
          include: {
            todo_list: {
              select: {
                title: true,
              },
            },
          },
          orderBy: [
            { priority: "desc" }, // Sort by highest priority
            { task: "asc" }, // Sort alphabetically as the second sort parameter
          ],
        });

        res.json(todos);
      } catch (error) {
        console.error("Dashboard ToDo-Error:", error);
        res.status(500).json({ error: "Failed to load all todos" });
      }
    },
  );

  return router;
};
