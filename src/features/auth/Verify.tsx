import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Lottie from "lottie-react";
import success from "../../data/success.json";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFireBase } from "../../firebase/hooks";
import { getItem, removeItem } from "../../utils/localStorage";
import { IVerifyUser } from "../../utils/types";

function Verify() {
  const navigate = useNavigate();
  const { setFireBaseUserDetails } = useFireBase();

  const updateVerificationStatus = useCallback(async () => {
    const { id, username } = getItem("user") as IVerifyUser;
    await setFireBaseUserDetails(id, {
      username: username,
      emailVerified: true,
    });
    removeItem("user");
    navigate("/login");
  }, [setFireBaseUserDetails, navigate]);

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
    </Container>
  );
}

export default Verify;
