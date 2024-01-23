import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../utils/types";

const initialState: IUser = {
  id: null,
  username: null,
  email: null,
  emailVerified: false,
  creationTime: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      return (state = action.payload);
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
