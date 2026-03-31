import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../models/User.ts";

// UserState interface
interface UserState {
  list: User[];
  loading: boolean;
}

/* Old Test Users:

    {
      id: "1",
      name: "Laura",
      surname: "Hoffmann",
      username: "lhoffmann",
      email: "laura.hoffmann@gmail.com",
      password: "sicher123",
      createdAt: "2025-01-08",
    },
    {
      id: "2",
      name: "Markus",
      surname: "Berger",
      username: "mberger92",
      email: "m.berger@outlook.com",
      password: "sicher456",
      createdAt: "2025-02-14",
    },
    {
      id: "3",
      name: "Sofia",
      surname: "Neumann",
      username: "sofia_n",
      email: "sofia.neumann@gmail.com",
      password: "sicher789",
      createdAt: "2025-03-22",
    },
    {
      id: "4",
      name: "Jonas",
      surname: "Krause",
      username: "jonaskrause",
      email: "jonas.krause@yahoo.com",
      password: "sicher321",
      createdAt: "2025-05-03",
    },
    {
      id: "5",
      name: "Anna",
      surname: "Weber",
      username: "annaweber",
      email: "a.weber@outlook.com",
      password: "sicher654",
      createdAt: "2025-07-19",
    },
  
 */

// Initial UserState (object)
const initialState: UserState = {
  list: [],
  loading: false,
};

// Redux user slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((user) => user.id !== action.payload);
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
