import express from "express";
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { authorizeAdmin } from "../middlewares/authMiddleware.js";

// Type extension for requests with authentication data
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const createUserRouter = () => {
  const router = express.Router();

  // Helper to ensure userId is present
  const getAuthUser = (req: AuthenticatedRequest) => {
    if (!req.user?.userId || !req.user?.role) throw new Error("Unauthorized");
    return req.user;
  };

  // GET: Returns a list of all users
  router.get(
    "/",
    authorizeAdmin,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            name: true,
            surname: true,
            email: true,
            role: true,
            createdAt: true,
            // Hashed passwords are being ignored for security reasons they shall not leave the API!
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: "Could not fetch users." });
      }
    },
  );

  // GET: User by ID (the id comes from the JWT token in this case)
  router.get("/me", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = getAuthUser(req);

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          // Hashed password is being ignored for security reasons, cause it shall not leave the API!
        },
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch user data." });
    }
  });

  // UPDATE: Updates a user's username, name and surname by ID
  router.put("/:id", async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { username, name, surname } = req.body;

    try {
      const { userId, role: userRole } = getAuthUser(req);

      // Check if user is updating their own profile or is admin
      if (userId !== parseInt(id) && userRole !== "admin") {
        return res.status(403).json({
          error: "You are not allowed to edit this users data.",
        });
      }

      if (!username || !name || !surname) {
        return res
          .status(400)
          .json({ error: "Username, name und surname sind erforderlich" });
      }

      const result = await prisma.user.update({
        data: {
          username: username,
          name: name,
          surname: surname,
        },
        where: {
          id: Number(id),
        },
      });

      if (!result) {
        return res
          .status(404)
          .json({ error: "User not found or no changes made." });
      }

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Username already exists." });
      }
      res.status(500).json({ error: "Update failed." });
    }
  });

  // DELETE: Deletes a user by ID
  router.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    try {
      const { userId, role: userRole } = getAuthUser(req);

      // Safety check: Only admins or the user themselves can delete an account
      if (userId !== parseInt(id) && userRole !== "admin") {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this user." });
      }

      const result = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });

      if (!result) {
        return res.status(404).json({ error: "User not found." });
      }

      const { username, surname, name } = result;

      res.json({
        message: `User "${username}", alias "${name}", "${surname}" with ID ${id} has been deleted.`,
      });
    } catch (error) {
      res.status(500).json({ error: "Delete failed." });
    }
  });

  return router;
};
