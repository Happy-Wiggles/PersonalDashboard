import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import userReducer from "../features/users/UserSlice.ts";
import quoteReducer from "../features/quotes/QuotesSlice.ts";
import toDoReducer from "../features/todos/ToDosSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    quotes: quoteReducer,
    todos: toDoReducer,
  },
});

// Export types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
