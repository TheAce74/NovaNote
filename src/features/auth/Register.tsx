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
import { IRegisterFormInputs } from "../../utils/types";
import { useAlert } from "../../hooks/useAlert";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getErrorMessage } from "../../utils/errorMessage";
import { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { ref, set } from "firebase/database";

function Register() {
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IRegisterFormInputs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
  });
  const theme = useAppTheme();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IRegisterFormInputs> = async (data) => {
    if (getValues("password") !== getValues("password2")) {
      showAlert("Password Mismatch", { variant: "error" });
      return;
    }
    setLoading(true);
    const { email, password, username } = data;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await set(ref(db, "users/" + user.uid), {
          username: username,
          email: email,
        });
        reset();
        showAlert("Registered successfully", { variant: "success" });
        navigate("/login");
      })
      .catch((error: unknown) => {
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
            error={!!errors.username}
            id="username-input"
            label="Username"
            helperText={errors.username?.message}
            {...register("username", {
              required: "Enter username",
            })}
            fullWidth={true}
            sx={{
              marginBottom: "1.5em",
            }}
          />
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
          <TextField
            error={!!errors.password}
            id="password-input"
            label="Password"
            helperText={errors.password?.message}
            {...register("password", {
              required: "Enter password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            fullWidth={true}
            sx={{
              marginBottom: "1.5em",
            }}
            type="password"
          />
          <TextField
            error={!!errors.password2}
            id="password2-input"
            label="Confirm Password"
            helperText={errors.password2?.message}
            {...register("password2", {
              required: "Enter confirm password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            fullWidth={true}
            sx={{
              marginBottom: "1.5em",
            }}
            type="password"
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
          >
            {!loading ? (
              <Box component="span">Register</Box>
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
            Already have an account?
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

export default Register;
