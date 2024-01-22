import { useAppSelector } from "../../redux/hooks";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { auth } from "../../firebase/firebase";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppTheme } from "../../mui/hooks";
import { useState } from "react";

function Dashboard() {
  const user = useAppSelector((state) => state.user);
  const theme = useAppTheme();
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const handleLogOut = () => {
    setOpenBackDrop(true);
    const timeout = setTimeout(() => {
      auth.signOut();
      setOpenBackDrop(false);
      clearTimeout(timeout);
    }, 3000);
  };

  return (
    <Box>
      <h1>Welcome {user.username}</h1>
      <Button variant="contained" onClick={handleLogOut}>
        Log Out
      </Button>
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
    </Box>
  );
}

export default Dashboard;
