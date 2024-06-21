import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailRegex } from "../../utils/regex";
import { useAppTheme } from "../../mui/hooks";
import { IResetPasswordFormInput } from "../../utils/types";
import { useAlert } from "../../hooks/useAlert";
import { Link } from "react-router-dom";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { getErrorMessage } from "../../utils/errorMessage";

function ResetPassword() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPasswordFormInput>({
    defaultValues: {
      email: "",
    },
  });
  const theme = useAppTheme();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IResetPasswordFormInput> = async (data) => {
    setLoading(true);
    const { email } = data;
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        showAlert("A reset email was sent to your mailbox");
        reset();
      })
      .catch((error) => {
        showAlert(getErrorMessage(error), { variant: "error" });
      });
    setLoading(false);
  };

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
          fontSize={48}
          paddingBottom={3}
        >
          NovaNote
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={!!errors.email}
            id="email-input"
            label="Email address"
            helperText={errors.email?.message}
            {...register("email", {
              required: "Enter email address",
              pattern: {
                value: emailRegex,
                message: "Enter a correct email address",
              },
            })}
            fullWidth={true}
            sx={{
              marginBottom: "1.5em",
            }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              padding: "0.8em",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
            disabled={loading}
          >
            {!loading ? (
              <Box component="span">Reset Password</Box>
            ) : (
              <Box
                sx={{ display: "flex" }}
                color={theme.palette.background.default}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}
          </Button>
          <Typography align="center" marginTop={1}>
            Ready to login?
            <Link to="/login">
              <Button
                sx={{
                  paddingBlock: 0,
                  paddingInline: ".3em",
                  minWidth: "max-content",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}

export default ResetPassword;
