import { ref, child, get, set } from "firebase/database";
import { User, deleteUser, sendEmailVerification } from "firebase/auth";
import { db, auth, storage } from "./firebase";
import { getErrorMessage } from "../utils/errorMessage";
import { useAlert } from "../hooks/useAlert";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser, updateProfilePic } from "../redux/userSlice";
import { IFireBaseSnapShot } from "../utils/types";
import { getKeys } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

function useFireBase() {
  const { showAlert } = useAlert();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username, notes } = useAppSelector((state) => state.user);

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
          const { username, notes, profilePic } =
            snapshot.val() as IFireBaseSnapShot;
          dispatch(
            setUser({
              id,
              username,
              email,
              emailVerified,
              creationTime,
              notes,
              profilePic,
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
          showAlert(getErrorMessage(error), { variant: "error" });
        }
      });
  };

  const sendVerificationEmail = async (user?: User) => {
    const currentUser = auth.currentUser ? auth.currentUser : user;
    if (currentUser) {
      await sendEmailVerification(currentUser).then(() => {
        showAlert("A verification email was sent to your inbox");
      });
    }
  };

  const getFireBaseDetails = async (
    id: string,
    title: string
  ): Promise<string> => {
    const dbRef = ref(db);
    return await get(child(dbRef, `users/${id}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const { notes } = snapshot.val() as IFireBaseSnapShot;
          if (notes) {
            const keys = getKeys(notes);
            const key = keys.filter((key) => notes[key].title === title)[0];
            if (!key) {
              throw new Error("Document doesn't exist");
            }
            return notes[key].text;
          } else {
            throw new Error("Document doesn't exist");
          }
        } else {
          throw new Error("No data available, check the url and try again");
        }
      })
      .catch((error: unknown) => {
        showAlert(getErrorMessage(error), { variant: "error" });
        navigate("/", { replace: true });
        return "";
      });
  };

  const setProfilePic = async (
    id: string,
    data: File | Blob,
    callback: () => void
  ) => {
    showAlert("Uploading...");
    const userRef = storageRef(storage, `users/${id}.jpg`);
    uploadBytes(userRef, data)
      .then(() => {
        getDownloadURL(userRef)
          .then(async (url) => {
            try {
              await setFireBaseUserDetails(
                id ?? "",
                {
                  username,
                  notes,
                  profilePic: url,
                },
                "Uploaded successfully"
              );
              dispatch(updateProfilePic(url));
            } catch (e) {
              console.error(e);
            } finally {
              callback();
            }
          })
          .catch((error) => {
            showAlert(getErrorMessage(error), { variant: "error" });
          });
      })
      .catch((error) => {
        showAlert(getErrorMessage(error), { variant: "error" });
      });
  };

  return {
    getFireBaseUserDetails,
    setFireBaseUserDetails,
    sendVerificationEmail,
    getFireBaseDetails,
    setProfilePic,
  };
}

export { useFireBase };
