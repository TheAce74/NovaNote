import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import { useAppTheme } from "../../../mui/hooks";
import { format } from "date-fns";
import { useFireBase } from "../../../firebase/hooks";

function Settings() {
  const user = useAppSelector((state) => state.user);
  const [userName, setUserName] = useState(user.username);
  const [userNameDisabled, setUserNameDisabled] = useState(true);
  const [email, setEmail] = useState(user.email);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const theme = useAppTheme();
  const { sendVerificationEmail } = useFireBase();
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleUserNameDisabled = () => {
    setUserNameDisabled(!userNameDisabled);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailDisabled = () => {
    setEmailDisabled(!emailDisabled);
  };

  const handleVerifyUser = async () => {
    setVerifyLoading(true);
    await sendVerificationEmail();
    setVerifyLoading(false);
  };

  return (
    <Box component="section">
      <Typography
        variant="h5"
        component="h1"
        fontWeight={600}
        marginBottom={1.5}
      >
        Profile
      </Typography>
      <Container
        maxWidth="md"
        sx={{
          marginLeft: "0 !important",
          paddingLeft: "0 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            src=""
            sx={{
              width: 100,
              height: 100,
            }}
          />
          <Button variant="contained">Update</Button>
        </Box>
        {user.emailVerified ? (
          <Typography
            marginLeft={1}
            marginBlock={1}
            color={theme.palette.primary.main}
            fontWeight={600}
          >
            Verified User
          </Typography>
        ) : (
          <Typography
            marginLeft={1}
            marginBlock={1}
            color={theme.palette.secondary.main}
            fontWeight={600}
          >
            Not Verified
          </Typography>
        )}
        <Typography marginTop={1}>
          Joined {user.creationTime && format(user.creationTime, "PPPP")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 2,
            flexWrap: "wrap",
            marginTop: "1.5em",
          }}
        >
          <TextField
            id="username-input"
            label="Username"
            sx={{
              flex: 1,
            }}
            value={userName}
            disabled={userNameDisabled}
            onChange={handleUserName}
          />
          <Button variant="contained" onClick={handleUserNameDisabled}>
            {userNameDisabled ? "Edit" : "Update"}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            gap: 2,
            flexWrap: "wrap",
            marginTop: "1.5em",
          }}
        >
          <TextField
            id="email-input"
            label="Email"
            sx={{
              flex: 1,
            }}
            value={email}
            disabled={emailDisabled}
            onChange={handleEmail}
          />
          <Button variant="contained" onClick={handleEmailDisabled}>
            {emailDisabled ? "Edit" : "Update"}
          </Button>
        </Box>
        {!user.emailVerified && (
          <>
            <Typography marginBlock={2} color={theme.palette.secondary.main}>
              *All unverified accounts are scheduled for deletion 3 days after
              creation
            </Typography>
            <Button variant="contained" onClick={handleVerifyUser}>
              {!verifyLoading ? (
                <Box component="span">Verify Account</Box>
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
          </>
        )}
      </Container>
    </Box>
  );
}

export default Settings;
