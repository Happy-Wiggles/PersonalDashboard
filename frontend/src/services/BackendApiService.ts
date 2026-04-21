import axios from "axios";
import type { AxiosInstance } from "axios";
import type { User } from "../types/User";
import type { ToDoListItem, CreateToDoListData } from "../types/ToDoListItem";
import type { ToDoItem, CreateToDoItemData } from "../types/ToDoItem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
      withCredentials: true, // Without it axios would ignore the httpOnly cookie with the refresh token
    });

    this.token = localStorage.getItem("authToken");

    // Uses the token from localStorage for each request if the token exists
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response, // If everything is fine, just continue
      async (error) => {
        const originalRequest = error.config;

        // If the error is 403 (forbidden) or 401 (unauthorized) and the refresh process is not already running
        if (
          (error.response?.status === 403 || error.response?.status === 401) &&
          !originalRequest._retry
        ) {
          // Infinite loops (cuz of the refresh endpoint throwing errors itsself) are not a thing anymore with this bad boy
          originalRequest._retry = true;

          try {
            // Tries to get a new access token from the backend
            // 'withCredentials: true' makes the refresh-cookie to be sent automatically as well
            const response = await axios.get<{ token: string }>(
              `${API_URL}/auth/refresh`,
              { withCredentials: true },
            );

            // Save the new token
            const newToken = response.data.token;
            this.setToken(newToken);

            // Update the authorization header of the original request with the new JWT token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Do the original request again with the new token
            return this.client(originalRequest);
          } catch (refreshError) {
            // Clear token and send user to login page if refresh doesnt work
            this.clearToken();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // If its any other error than 403 or 401
        return Promise.reject(error);
      },
    );
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
  async getUsersAsync(): Promise<User[]> {
    const response = await this.client.get<User[]>("/users");
    return response.data;
  }

  // Partial<Omit<User, "id" | "email" | "createdAt">> means that everything in User can be updated, except the listed properties (id, email and createdAt)
  async updateUser(
    id: string,
    data: Partial<Omit<User, "id" | "email" | "createdAt">>,
  ): Promise<User> {
    const response = await this.client.put<User>(`/users/${id}`, data);

    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/users/${id}`,
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
  async getToDosByListId(listId: number): Promise<ToDoItem[]> {
    const response = await this.client.get<ToDoItem[]>(
      `/todos/lists/${listId}/todos`,
    );

    return response.data;
  }

  async getAllToDos(): Promise<ToDoItem[]> {
    const response = await this.client.get<ToDoItem[]>(`/todos/user/todos`);
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
