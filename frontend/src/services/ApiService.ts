import axios from "axios";
import type { AxiosInstance } from "axios";
import type { User } from "../models/User";

const API_URL = "http://localhost:3000";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

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
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Load token from localStorage on initialization
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      this.setToken(storedToken);
    }

    // Add request interceptor to include token in all requests
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

  // AUTH ENDPOINTS
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/register",
      data,
    );
    return response.data;
  }

  // USER ENDPOINTS
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

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await this.client.delete<{ message: string }>(
      `/users/${id}`,
    );
    return response.data;
  }
}

export const apiClient = new APIClient();
export type { AuthResponse, User, LoginCredentials, RegisterData };
