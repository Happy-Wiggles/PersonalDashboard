import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/User";
import { apiClient } from "../../services/BackendApiService";
import { updateUserAsync } from "../users/UserSlice";
import axios from "axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  token: null,
  loading: true, // Start loading as true - wait for Auth-Initialization
  error: null,
};

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

// AsyncThunk: Initialize Auth on App Start
// Checks if a token exists in localStorage and restores the auth state
// This ensures the user stays logged in even after page reload or component navigation
const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const userJSON = localStorage.getItem("authUser");

      console.log("[Auth Debug] initializeAuth running...");
      console.log("[Auth Debug] Token from localStorage:", !!token);
      console.log("[Auth Debug] User from localStorage:", !!userJSON);

      // If no token or user data in localStorage, user is not authenticated
      if (!token || !userJSON) {
        console.log("[Auth Debug] No auth data found in localStorage");
        return null;
      }

      // Parse the stored user data
      const user = JSON.parse(userJSON) as User;

      console.log("[Auth Debug] Successfully restored auth state");
      console.log("[Auth Debug] User:", user.name);

      // Restore token in ApiClient
      apiClient.setToken(token);

      // Return the restored auth state
      return { token, user };
    } catch (error: unknown) {
      const err = error as ApiError;

      console.error("[Auth Debug] Error during auth initialization:", error);

      // If parsing fails, clear the invalid data
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      return rejectWithValue(
        err.response?.data?.error || "Failed to restore authentication.",
      );
    }
  },
);

// AsyncThunk: Login
// It takes credentials, calls the API, and then dispatches a success/failure action
const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.login(credentials);
      // Store token in localStorage (handled by ApiService internally)
      return response;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.error || "Login failed. Please try again.",
        );
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue("An unknown error occurred");
    }
  },
);

// AsyncThunk: Register
// Uses Omit to avoid repeating User field definitions
const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData: Omit<User, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      if (userData.username.includes("admin")) {
        throw Error("Username can't be admin!");
      }

      const response = await apiClient.register(userData);
      return response;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.error || "Registration failed. Please try again.",
        );
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue("An unknown error occurred");
    }
  },
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.token = null;
      state.error = null;
      // Clear persisted auth data from localStorage
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      apiClient.clearToken();
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Handle initializeAuth lifecycle
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          // Token and user data were found in localStorage
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.isAdmin = action.payload.user.role === "admin";
        } else {
          // No stored auth data
          state.isAuthenticated = false;
        }
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        console.error(
          "[Auth Debug] Auth initialization failed:",
          action.payload,
        );
      });

    // Handle loginAsync lifecycle
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === "admin";

        // Persist user data to localStorage for hydration on page reload
        localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        localStorage.setItem("authToken", action.payload.token);

        // Store token in ApiClient so future requests include the token
        apiClient.setToken(action.payload.token);
        console.log("[Auth Debug] User logged in:", action.payload.user.name);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Handle registerAsync lifecycle
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.user || !action.payload.token) {
          console.log(
            "[Auth Debug] User or token have not been there to be saved into localStorage!",
          );
          state.error =
            "[Auth Debug] User or token have not been there to be saved into localStorage!";
          state.isAuthenticated = false;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.isAdmin = action.payload.user.role === "admin";

          // Persist user data to localStorage for hydration on page reload
          localStorage.setItem("authUser", JSON.stringify(action.payload.user));
          localStorage.setItem("authToken", action.payload.token);

          // Store token in ApiClient so future requests include the token
          apiClient.setToken(action.payload.token);

          console.log(
            "[Auth Debug] User registered:",
            action.payload.user.name,
          );
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      if (state.user && state.user.id === action.payload?.id) {
        // Update the user data in AuthState immediately
        state.user = action.payload;
        state.isAdmin = action.payload.role === "admin";

        localStorage.setItem("authUser", JSON.stringify(action.payload));

        console.log("[Auth Sync] Auth state updated via UserSlice");
      }
    });
  },
});

export const { loginSuccess, logout, clearError } = AuthSlice.actions;
export { initializeAuth, loginAsync, registerAsync };
export default AuthSlice.reducer;
