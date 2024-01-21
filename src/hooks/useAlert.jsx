import { useSnackbar } from "notistack";
import { MdClose } from "react-icons/md";

function useAlert() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (id) => (
    <button className="alert-btn" onClick={() => closeSnackbar(id)}>
      <MdClose />
    </button>
  );

  const showAlert = (
    message,
    {
      autoHideDuration = 5000,
      variant = "info",
      anchorOrigin = { horizontal: "right", vertical: "top" },
    }
  ) => {
    const key = enqueueSnackbar(message, {
      autoHideDuration,
      variant,
      anchorOrigin,
      action,
    });

    //in case you need to close a particular snackbar after some action
    return key;
  };

  const closeAlert = (key) => {
    closeSnackbar(key);
  };

  const closeAllAlerts = () => {
    closeSnackbar();
  };

  return { showAlert, closeAlert, closeAllAlerts };
}

export { useAlert };
