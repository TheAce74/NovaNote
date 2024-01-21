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
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
