import { Login } from "../shared/types/Login";

export function saveUserData(login: Login): void {
  localStorage.setItem("accessToken", login.accessToken);
  localStorage.setItem("userId", login.user.id.toString());
}

export function getCurrentUserData(): Login {
  const login: Login = {
    accessToken: localStorage.getItem("accessToken") || "",
    user: {
      id: localStorage.getItem("userId") || "",
      email: ""
    }
  }
  return login;
}

export function removeUserData(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
}
