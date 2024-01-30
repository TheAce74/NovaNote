import { SnackbarKey, useSnackbar } from "notistack";
import { MdClose } from "react-icons/md";
import { TAlert } from "../utils/types";
import { useCallback } from "react";

function useAlert() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = useCallback(
    (id: SnackbarKey) => (
      <button className="alert-btn" onClick={() => closeSnackbar(id)}>
        <MdClose />
      </button>
    ),
    [closeSnackbar]
  );

  const showAlert: TAlert = useCallback(
    (message: string, options) => {
      const key = enqueueSnackbar(message, {
        autoHideDuration: options?.autoHideDuration
          ? options.autoHideDuration
          : 3000,
        variant: options?.variant ? options.variant : "info",
        anchorOrigin: options?.anchorOrigin
          ? options.anchorOrigin
          : { horizontal: "right", vertical: "top" },
        action,
      });

      //in case you need to close a particular snackbar after some action
      return key;
    },
    [action, enqueueSnackbar]
  );

  const closeAlert = (key: SnackbarKey) => {
    closeSnackbar(key);
  };

  const closeAllAlerts = () => {
    closeSnackbar();
  };

  return { showAlert, closeAlert, closeAllAlerts };
}

export { useAlert };
