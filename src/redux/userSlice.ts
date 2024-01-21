import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  username: string | null;
  email: string | null;
}

const initialState: IUser = {
  username: null,
  email: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
