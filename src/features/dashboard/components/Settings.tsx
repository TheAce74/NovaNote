import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ChangeEvent, useState } from "react";
import { useAppTheme } from "../../../mui/hooks";
import { format } from "date-fns";
import { useFireBase } from "../../../firebase/hooks";
import { styled } from "@mui/material/styles";
import { validateImage } from "../../../utils/functions";
import { useAlert } from "../../../hooks/useAlert";
import { updateUserName } from "../../../redux/userSlice";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function Settings() {
  const user = useAppSelector((state) => state.user);
  const [userName, setUserName] = useState(user.username);
  const [userNameDisabled, setUserNameDisabled] = useState(true);
  const theme = useAppTheme();
  const { sendVerificationEmail, setProfilePic } = useFireBase();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [changeNameLoading, setChangeNameLoading] = useState(false);
  const { showAlert } = useAlert();
  const { setFireBaseUserDetails } = useFireBase();
  const dispatch = useAppDispatch();

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleVerifyUser = async () => {
    setVerifyLoading(true);
    await sendVerificationEmail();
    setVerifyLoading(false);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const report = validateImage(file);
      if (report[0]) {
        setUploadLoading(true);
        await setProfilePic(user.id ?? "", file, () => setUploadLoading(false));
      } else {
        showAlert(report[1], {
          variant: "error",
        });
      }
    }
  };

  const handleUpdateUserName = async () => {
    if (userName?.trim() === user.username?.trim()) {
      showAlert("No changes have been made");
      return;
    }
    setChangeNameLoading(true);
    try {
      await setFireBaseUserDetails(
        user.id ?? "",
        {
          username: userName,
          notes: user.notes,
          profilePic: user.profilePic,
        },
        "Updated successfully"
      );
      dispatch(updateUserName(userName ?? ""));
    } catch (e) {
      console.error(e);
    } finally {
      setChangeNameLoading(false);
      setUserNameDisabled(true);
    }
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
            src={user.profilePic}
            sx={{
              width: 100,
              height: 100,
            }}
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            disabled={uploadLoading}
          >
            {!uploadLoading ? (
              <>
                Update
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleUpload}
                  accept=".jpg,.png"
                />
              </>
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
          <Button
            variant="contained"
            onClick={
              userNameDisabled
                ? () => setUserNameDisabled(false)
                : handleUpdateUserName
            }
            disabled={changeNameLoading}
          >
            {!changeNameLoading ? (
              <Box component="span">{userNameDisabled ? "Edit" : "Update"}</Box>
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
        </Box>
        {!user.emailVerified && (
          <>
            <Typography marginBlock={2} color={theme.palette.secondary.main}>
              *All unverified accounts are scheduled for deletion 3 days after
              creation
            </Typography>
            <Button
              variant="contained"
              onClick={handleVerifyUser}
              disabled={verifyLoading}
            >
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
