import { Login } from "../shared/types/Login";

export function saveUserData(login: Login): void {
  localStorage.setItem("accessToken", login.accessToken);
  localStorage.setItem("userId", login.user.id.toString());
  localStorage.setItem("operationId", login.operationId);
  localStorage.setItem("role", login.role || "frentista");
  localStorage.setItem("roleId", login.roleId);
}

export function getCurrentUserData(): Login {
  const login: Login = {
    accessToken: localStorage.getItem("accessToken") || "",
    user: {
      id: localStorage.getItem("userId") || "",
      email: ""
    },
    operationId: localStorage.getItem("operationId") || "",
    role: ((): "proprietário" | "administrador" | "gerente" | "frentista" => {
      const role = localStorage.getItem("role");
      if (role === "proprietário" || role === "administrador" || role === "gerente" || role === "frentista") {
        return role;
      }
      return "frentista";
    })(),
    roleId: localStorage.getItem("roleId") || "",
  }
  return login;
}

export function removeUserData(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
}
