import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./components/Error";
import { SnackbarProvider } from "notistack";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  const router = createBrowserRouter([
    {
      element: (
        <Provider store={store}>
          <SnackbarProvider>
            <Outlet />
          </SnackbarProvider>
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
