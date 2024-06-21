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
import { ILoginFormInputs } from "../../utils/types";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorMessage";
import { useAlert } from "../../hooks/useAlert";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

function Login() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const theme = useAppTheme();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    setLoading(true);
    const { email, password } = data;
    await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        showAlert("Logged in successfully", { variant: "success" });
        navigate("/");
        reset();
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
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    marginRight: ".2em",
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
              <Box component="span">Login</Box>
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
            Don't have an account?
            <Link to="/register">
              <Button
                sx={{
                  paddingBlock: 0,
                  paddingInline: ".3em",
                  minWidth: "max-content",
                  fontWeight: 600,
                }}
              >
                Register
              </Button>
            </Link>
          </Typography>
          <Typography align="center">
            Forgot password?
            <Link to="/reset">
              <Button
                sx={{
                  paddingBlock: 0,
                  paddingInline: ".3em",
                  minWidth: "max-content",
                  fontWeight: 600,
                }}
              >
                Reset password
              </Button>
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;
