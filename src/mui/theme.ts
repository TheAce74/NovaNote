import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
  },
  palette: {
    primary: {
      main: "#1a5e63",
    },
    secondary: {
      main: "#931621",
    },
    text: {
      primary: "#242038",
    },
    background: {
      paper: "#F7F8F7",
      default: "#f3f7f0",
    },
  },
});

export { theme };
