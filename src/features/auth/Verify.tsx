import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Lottie from "lottie-react";
import success from "../../data/success.json";
import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useAlert } from "../../hooks/useAlert";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { getErrorMessage } from "../../utils/errorMessage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppTheme } from "../../mui/hooks";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const theme = useAppTheme();
  const [openBackDrop, setOpenBackDrop] = useState(true);

  const updateVerificationStatus = useCallback(async () => {
    const parsed = queryString.parse(location.search);
    switch (parsed.mode) {
      case "resetPassword":
        navigate("/confirmReset", {
          state: {
            actionCode: parsed.oobCode,
          },
        });
        break;
      case "verifyEmail":
        setOpenBackDrop(false);
        if (typeof parsed.oobCode === "string") {
          await applyActionCode(auth, parsed.oobCode)
            .then(() => {
              showAlert("Email verified successfully", {
                variant: "success",
              });
            })
            .catch((error) => {
              showAlert(getErrorMessage(error), {
                variant: "error",
              });
            });
          navigate("/login");
        }
        break;
      default:
        showAlert("An unexpected error occurred, try again later", {
          variant: "error",
        });
    }
  }, [navigate, location.search, showAlert]);

  useEffect(() => {
    updateVerificationStatus();
  }, [updateVerificationStatus]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          padding: "2em",
        }}
      >
        <Typography
          variant="h1"
          fontWeight={700}
          textAlign="center"
          fontSize={36}
          paddingBottom={3}
        >
          Email Verification
        </Typography>
        <Lottie
          animationData={success}
          loop={0}
          style={{
            height: 150,
          }}
        />
        <Typography textAlign="center" paddingTop={3}>
          Your email has been successfully verified. You will be redirected to
          the login page soon, please do not leave this page
        </Typography>
      </Card>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.text.primary,
        }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default Verify;
