import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailRegex } from "../../utils/regex";

interface IFormInputs {
  username: string;
  email: string;
  password: string;
}

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log(data);
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
            Register
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

export default Register;
