import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppTheme } from "../../mui/hooks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/userSlice";
import { useFireBase } from "../../firebase/hooks";

type ProtectedProps = {
  children: React.ReactNode;
};

function Protected({ children }: ProtectedProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const { getFireBaseUserDetails } = useFireBase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const {
          uid,
          email,
          emailVerified,
          metadata: { creationTime },
        } = user;
        await getFireBaseUserDetails(uid, email, emailVerified, creationTime);
      } else {
        dispatch(
          setUser({
            id: null,
            email: null,
            username: null,
            emailVerified: false,
            creationTime: undefined,
            notes: "",
          })
        );
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.text.primary,
        }}
        open={!user.id}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {user.id && children}
    </>
  );
}

export default Protected;
