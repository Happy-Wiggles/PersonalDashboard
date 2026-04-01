import axios from "axios";
import type { AxiosInstance } from "axios";
import type { User } from "../types/User";
import type { ToDoListItem, CreateToDoListData } from "../types/ToDoListItem";
import type { ToDoItem, CreateToDoItemData } from "../types/ToDoItem";

const API_URL = "http://localhost:3000";

// --- Interfaces ---
interface LoginCredentials {
  email: string;
  password: string;
}
type RegisterData = Omit<User, "id" | "createdAt">;
interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.token = localStorage.getItem("authToken");

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // --- AUTH ---
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    if (response.data.token) this.setToken(response.data.token);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/register",
      data,
    );
    return response.data;
  }

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>("/users");
    return response.data;
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "email" | "createdAt">>,
  ): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/users/${id}`,
      data,
    );
    return response.data;
  }

  // --- TODO LISTS ---
  async getToDoLists(): Promise<ToDoListItem[]> {
    const response = await this.client.get<ToDoListItem[]>("/todos/lists");
    return response.data;
  }

  async createToDoList(data: CreateToDoListData): Promise<ToDoListItem> {
    const response = await this.client.post<ToDoListItem>("/todos/lists", data);
    return response.data;
  }

  async deleteToDoList(id: number): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/todos/lists/${id}`,
    );
    return response.data;
  }

  // --- TODO ITEMS (ToDos inside a list) ---
  async getToDoByListId(listId: number): Promise<ToDoItem[]> {
    const response = await this.client.get<ToDoItem[]>(
      `/todos/lists/${listId}/todos`,
    );
    return response.data;
  }

  async addToDoToList(
    listId: number,
    data: CreateToDoItemData,
  ): Promise<ToDoItem> {
    const response = await this.client.post<ToDoItem>(
      `/todos/lists/${listId}/todos`,
      data,
    );
    return response.data;
  }

  // Partial<Pick<ToDoItem, "completed" | "priority">> makes 3 scenarios possible:
  // 1: { completed: true } (no other value is being set or changed)
  // 2: { priority: 5 } (again no other value is being set or changed)
  // 3:{ completed: true, priority: 5 } (Both are being changed at the same time, but no other values)
  async updateToDo(
    toDoId: number,
    data: Partial<Pick<ToDoItem, "completed" | "priority">>,
  ): Promise<{ message: string }> {
    const response = await this.client.put<{ message: string }>(
      `/todos/items/${toDoId}`,
      data,
    );
    return response.data;
  }

  async deleteToDo(toDoId: number): Promise<{ message: string }> {
    console.log("Lösche ToDo mit Pfad:", `/todos/items/${toDoId}`);
    const response = await this.client.delete<{ message: string }>(
      `/todos/items/${toDoId}`,
    );
    return response.data;
  }
}

export const apiClient = new APIClient();
