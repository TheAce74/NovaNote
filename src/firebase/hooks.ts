import { ref, child, get, set } from "firebase/database";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
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
    emailVerified: boolean,
    creationTime: string | undefined
  ) => {
    const dbRef = ref(db);
    await get(child(dbRef, `users/${id}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const { username, notes } = snapshot.val() as IFireBaseSnapShot;
          dispatch(
            setUser({
              id,
              username,
              email,
              emailVerified,
              creationTime,
              notes
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

  //unused
  const reAuthenticateUser = async (
    email: string,
    password: string,
    callback: () => void
  ) => {
    const credential = EmailAuthProvider.credential(email, password);
    const user = auth.currentUser;
    if (user) {
      await reauthenticateWithCredential(user, credential)
        .then(() => {
          callback();
        })
        .catch((error) => {
          showAlert(getErrorMessage(error), { variant: "error" });
        });
    } else {
      showAlert("User not found", { variant: "error" });
    }
  };

  //unused
  const changeUserPassword = async (newPassword: string) => {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword)
        .then(() => {
          showAlert("Password changed successfully", { variant: "success" });
        })
        .catch((error) => {
          showAlert(getErrorMessage(error), { variant: "error" });
        });
    } else {
      showAlert("User not found", { variant: "error" });
    }
  };

  return {
    getFireBaseUserDetails,
    setFireBaseUserDetails,
    reAuthenticateUser,
    changeUserPassword,
  };
}

export { useFireBase };
