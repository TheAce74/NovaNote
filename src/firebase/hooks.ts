import { ref, child, get, set } from "firebase/database";
import { deleteUser } from "firebase/auth";
import { db, auth } from "./firebase";
import { getErrorMessage } from "../utils/errorMessage";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { IFireBaseSnapShot } from "../utils/types";

function useFireBase() {
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();

  const getFireBaseUserDetails = async (
    id: string,
    email: string | null,
    creationTime: string | undefined
  ) => {
    const dbRef = ref(db);
    await get(child(dbRef, `users/${id}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const { username, emailVerified } =
            snapshot.val() as IFireBaseSnapShot;
          dispatch(
            setUser({
              id,
              username,
              email,
              emailVerified,
              creationTime,
            })
          );
        } else {
          let user;
          if (auth.currentUser) {
            user = auth.currentUser;
            await deleteUser(user);
          }
          throw new Error("No data available, please create an account");
        }
      })
      .catch((error: unknown) => {
        showAlert(getErrorMessage(error), { variant: "error" });
      });
  };

  const setFireBaseUserDetails = async (
    id: string,
    data: unknown,
    message?: string
  ) => {
    await set(ref(db, "users/" + id), data)
      .then(() => {
        if (message) {
          showAlert(message, { variant: "success" });
        }
      })
      .catch((error) => {
        if (message) {
          showAlert(getErrorMessage(error), { variant: "success" });
        }
      });
  };

  return { getFireBaseUserDetails, setFireBaseUserDetails };
}

export { useFireBase };
