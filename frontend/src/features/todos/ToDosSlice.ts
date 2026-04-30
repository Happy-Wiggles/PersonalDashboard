import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  CreateToDoListData,
  ToDoListItem,
} from "../../types/ToDoListItem.ts";
import { apiClient } from "../../services/BackendApiService";
import type { User } from "../../types/User.ts";
import type { CreateToDoItemData, ToDoItem } from "../../types/ToDoItem.ts";

interface ToDosState {
  toDoListItems: ToDoListItem[];
  toDos: ToDoItem[];
  user: User;
  loading: boolean;
  error: string | null;
}

const initialState: ToDosState = {
  toDoListItems: [],
  toDos: [],
  user: {
    id: "",
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "user",
    createdAt: "",
  },
  loading: false,
  error: null,
};

export const fetchToDoListsAsync = createAsyncThunk(
  "todos/fetchAllToDoLists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getToDoLists();

      if (!response) {
        throw Error(
          "ToDoLists could not be loaded... Maybe the server is down?",
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch ToDoLists.");
      }
    }
  },
);

export const createToDoListAsync = createAsyncThunk(
  "todos/createToDoList",
  async (newList: CreateToDoListData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createToDoList(newList);

      if (!response) {
        throw Error(
          "ToDoLists could not be loaded... Maybe the server is down?",
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to create ToDoList.");
      }
    }
  },
);

export const deleteToDoListAsync = createAsyncThunk(
  "todos/deleteToDoList",
  async (listId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.deleteToDoList(listId);

      if (!response) {
        throw Error(
          "ToDoLists could not be loaded... Maybe the server is down?",
        );
      }

      return listId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch ToDoLists.");
      }
    }
  },
);

export const fetchToDosByListIdAsync = createAsyncThunk(
  "todos/fetchToDosByListId",
  async (listId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.getToDosByListId(listId);

      if (!response) {
        throw Error(
          "ToDos could not be loaded... Wrong List ID? Maybe the server is down?",
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch ToDos.");
      }
    }
  },
);

export const fetchAllUserToDosAsync = createAsyncThunk(
  "todos/fetchAllUserToDos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getAllToDos();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch all user ToDos.",
        );
      }
    }
  },
);

export const addToDoToListAsync = createAsyncThunk(
  "todos/addToDoToList",
  async (
    {
      toDoListId,
      toDoItem,
    }: { toDoListId: number; toDoItem: CreateToDoItemData },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.addToDoToList(toDoListId, toDoItem);

      if (!response) {
        throw Error(
          "ToDos could not be added to the list... Wrong List ID? Maybe the server is down?",
        );
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to add ToDo to List.");
      }
    }
  },
);

export const updateToDoAsync = createAsyncThunk(
  "todos/updateToDo",
  async (
    {
      toDoId,
      data,
    }: {
      toDoId: number;
      data: Partial<Pick<ToDoItem, "completed" | "priority">>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.updateToDo(toDoId, data);

      if (!response) {
        throw Error(
          "ToDoLists could not be loaded... Maybe the server is down?",
        );
      }

      return { id: toDoId, ...data };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch ToDoLists.");
      }
    }
  },
);

export const deleteToDoAsync = createAsyncThunk(
  "todos/deleteToDo",
  async (toDoId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.deleteToDo(toDoId);

      if (!response) {
        throw Error(
          "ToDo could not be deleted... Wrong ToDo ID? Maybe the server is down?",
        );
      }

      return toDoId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to delete ToDo.");
      }
    }
  },
);

const ToDosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch ToDos Lifecycle
    builder
      .addCase(fetchToDoListsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToDoListsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDoListItems = action.payload as ToDoListItem[];
      })
      .addCase(fetchToDoListsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create ToDoList Lifecycle
    builder
      .addCase(createToDoListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createToDoListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDoListItems = [
          ...state.toDoListItems,
          action.payload as ToDoListItem,
        ];
      })
      .addCase(createToDoListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete ToDoList Lifecycle
    builder
      .addCase(deleteToDoListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteToDoListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const deletedListId = action.payload;

        // Remove the deleted list from the state
        state.toDoListItems = state.toDoListItems.filter(
          (list) => list.id !== deletedListId,
        );

        // Also remove all ToDos that belonged to the deleted list
        state.toDos = state.toDos.filter(
          (toDo) => toDo.listId !== deletedListId,
        );
      })
      .addCase(deleteToDoListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch ToDos by List ID lifecycle
    builder
      .addCase(fetchToDosByListIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToDosByListIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDos = action.payload as ToDoItem[];
      })
      .addCase(fetchToDosByListIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add ToDoListItems to List lifecycle
    builder
      .addCase(addToDoToListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToDoToListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDos = [...state.toDos, action.payload as ToDoItem];
      })
      .addCase(addToDoToListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update ToDo lifecycle
    builder
      .addCase(updateToDoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateToDoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDos = state.toDos.map((toDo) => {
          if (action.payload && toDo.id === action.payload.id) {
            const { ...updates } = action.payload;
            return { ...toDo, ...updates };
          }
          return toDo;
        });
      })
      .addCase(updateToDoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete ToDo lifecycle
    builder
      .addCase(deleteToDoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteToDoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.toDos = state.toDos.filter((toDo) => toDo.id !== action.payload);
      })
      .addCase(deleteToDoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAllUserToDosAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserToDosAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.toDos = action.payload as ToDoItem[];
      })
      .addCase(fetchAllUserToDosAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = ToDosSlice.actions;
export default ToDosSlice.reducer;
