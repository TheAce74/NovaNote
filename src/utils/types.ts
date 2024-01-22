import { SnackbarKey } from "notistack";

// types
export type TAlertOptions = {
  autoHideDuration?: number;
  variant?: "info" | "default" | "error" | "success" | "warning" | undefined;
  anchorOrigin?: {
    horizontal: "left" | "center" | "right";
    vertical: "top" | "bottom";
  };
};

export type TAlert = (message: string, options?: TAlertOptions) => SnackbarKey;

// interfaces
export interface IRegisterFormInputs {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface ILoginFormInputs {
  email: string;
  password: string;
}

export interface IResetPasswordFormInput {
  email: string;
}

export interface IUser {
  id: string | null;
  username: string | null;
  email: string | null;
}

export interface FireBaseSnapShot {
  username: string;
  email: string;
}
