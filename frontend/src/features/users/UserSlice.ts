import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types/User.ts";
import { apiClient } from "../../services/BackendApiService";
import { logout } from "../auth/AuthSlice"; // Import logout to trigger it after deletion

interface UserState {
  loggedInUser: User | null;
  allUsers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  loggedInUser: null,
  allUsers: [],
  loading: false,
  error: null,
};

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const users = await apiClient.getUsersAsync();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch users");
      }
    }
  },
);

// AsyncThunk: Update User
export const updateUserAsync = createAsyncThunk(
  "user/update",
  async (user: User, { rejectWithValue }) => {
    try {
      const updatedUser = await apiClient.updateUser(user.id, user);

      // Update LocalStorage with the returned user
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Update failed");
      }
    }
  },
);

// AsyncThunk: Delete User
export const deleteUserAsync = createAsyncThunk(
  "user/delete",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.deleteUser(id);

      // If user deletes themselves, trigger logout to clear auth state
      if (id === JSON.parse(localStorage.getItem("authUser") || "{}").id) {
        dispatch(logout());
      }

      return id;
    } catch (error: unknown) {
      if (error instanceof Error)
        return rejectWithValue(error.message || "Deletion failed");
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update User Lifecycle
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser = action.payload as User;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete User Lifecycle
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.loggedInUser = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
