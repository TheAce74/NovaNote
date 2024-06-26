import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotes, IUser } from "../utils/types";

const initialState: IUser = {
  id: null,
  username: null,
  email: null,
  emailVerified: false,
  creationTime: undefined,
  notes: "",
  profilePic: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<IUser>) => {
      return action.payload;
    },
    addNote: (state, action: PayloadAction<INotes>) => {
      state.notes = { ...state.notes, ...action.payload };
    },
    editTitle: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
      }>
    ) => {
      const { id, title } = action.payload;
      if (state.notes) {
        state.notes[id].title = title;
      }
    },
    editNote: (
      state,
      action: PayloadAction<{
        id: number;
        text: string;
      }>
    ) => {
      const { id, text } = action.payload;
      if (state.notes) {
        state.notes[id].text = text;
      }
    },
    setNotes: (state, action: PayloadAction<INotes>) => {
      state.notes = action.payload;
    },
    updateProfilePic: (state, action: PayloadAction<string>) => {
      state.profilePic = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const {
  setUser,
  addNote,
  editTitle,
  editNote,
  setNotes,
  updateProfilePic,
  updateUserName,
} = userSlice.actions;

export default userSlice.reducer;
