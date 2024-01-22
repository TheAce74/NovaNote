import { ref, child, get } from "firebase/database";
import { db } from "./firebase";
import { getErrorMessage } from "../utils/errorMessage";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import { FireBaseSnapShot } from "../utils/types";

function useFireBase() {
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();

  const getFireBaseUserDetails = async (id: string) => {
    const dbRef = ref(db);
    await get(child(dbRef, `users/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const { email, username } = snapshot.val() as FireBaseSnapShot;
          dispatch(
            setUser({
              id: id,
              username: username,
              email: email,
            })
          );
        } else {
          console.log("No data available");
        }
      })
      .catch((error: unknown) => {
        showAlert(getErrorMessage(error), { variant: "error" });
      });
  };

  return { getFireBaseUserDetails };
}

export { useFireBase };
