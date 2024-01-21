import { useTheme } from "@mui/material/styles";

function useAppTheme() {
  const theme = useTheme();
  return theme;
}

export { useAppTheme };
