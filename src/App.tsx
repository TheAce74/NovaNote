import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./components/Error";
import { SnackbarProvider } from "notistack";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import Login from "./features/auth/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./mui/theme";
import ResetPassword from "./features/auth/ResetPassword";
import Protected from "./features/guard/Protected";
import Verify from "./features/auth/Verify";
import ConfirmResetPassword from "./features/auth/ConfirmResetPassword";
import Home from "./features/dashboard/components/Home";
import Settings from "./features/dashboard/components/Settings";
import Documents from "./features/dashboard/components/Documents";

function App() {
  const router = createBrowserRouter([
    {
      element: (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <Outlet />
            </SnackbarProvider>
          </ThemeProvider>
        </Provider>
      ),
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: (
            <Protected>
              <Dashboard />
            </Protected>
          ),
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/settings",
              element: <Settings />,
            },
            {
              path: "/documents",
              element: <Documents />,
            },
          ],
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/reset",
          element: <ResetPassword />,
        },
        {
          path: "/verify",
          element: <Verify />,
        },
        {
          path: "/confirmReset",
          element: <ConfirmResetPassword />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
