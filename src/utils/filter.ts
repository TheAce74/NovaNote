import { IUser } from "./types";

const filterUserNotes = (notes: string[], user: IUser, filter: string) => {
  return notes.filter((note) => {
    if (user.notes !== "") {
      return user.notes[note].title
        .toLowerCase()
        .includes(filter.toLowerCase());
    }
  });
};

export { filterUserNotes };
