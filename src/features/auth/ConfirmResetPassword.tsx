import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  Auth,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAlert } from "../../hooks/useAlert";
import { getErrorMessage } from "../../utils/errorMessage";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppTheme } from "../../mui/hooks";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

function ConfirmResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { actionCode } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const theme = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const protectResetRoute = useCallback(() => {
    if (!actionCode) {
      navigate("/login");
    }
  }, [actionCode, navigate]);

  const handleResetPassword = useCallback(
    async (auth: Auth, actionCode: string) => {
      await verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
          setEmail(email);
          setOpenDialog(true);
        })
        .catch((error) => {
          showAlert(getErrorMessage(error), { variant: "error" });
          navigate("/reset");
        });
    },
    [showAlert, navigate]
  );

  const handleConfirmReset = async (newPassword: string) => {
    await confirmPasswordReset(auth, actionCode, newPassword)
      .then(() => {
        handleClose();
        showAlert("Password reset successfully", { variant: "success" });
        navigate("/login");
      })
      .catch((error) => {
        showAlert(getErrorMessage(error), { variant: "error" });
        navigate("/reset");
      });
  };

  useEffect(() => {
    protectResetRoute();
    handleResetPassword(auth, actionCode);
  }, [protectResetRoute, handleResetPassword, actionCode]);

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
          paddingBottom={1}
        >
          Confirm Password Reset
        </Typography>
        <Typography textAlign="center" lineHeight={1.8}>
          We are currently confirming your reset request. You will be directed
          on what to do next, please do not leave this page
        </Typography>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const password = formJson.password as string;
            handleConfirmReset(password);
          },
        }}
      >
        <DialogTitle
          fontWeight={600}
          sx={{
            paddingBottom: 1,
          }}
        >
          Enter new Password
        </DialogTitle>
        <DialogContent
          sx={{
            paddingBottom: 1,
          }}
        >
          <DialogContentText>
            Confirm password reset request for <b>{email}</b>. Password must be
            at least 8 characters
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="normal"
            id="password"
            name="password"
            label="New Password"
            fullWidth
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
        </DialogContent>
        <DialogActions
          sx={{
            marginBottom: 1,
            marginRight: 2,
          }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {!loading ? (
              <Box component="span">Submit</Box>
            ) : (
              <Box
                sx={{ display: "flex" }}
                color={theme.palette.background.default}
              >
                <CircularProgress
                  color="inherit"
                  sx={{
                    width: "1.8em !important",
                    height: "1.8em !important",
                  }}
                />
              </Box>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ConfirmResetPassword;
