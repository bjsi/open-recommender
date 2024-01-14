import React from "react";
import { AuthInfo } from "./types";

export function useAuth(): AuthInfo | undefined {
  const [auth, setAuth] = React.useState<AuthInfo>();
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        setAuth({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch((error) => {
        setAuth({
          authenticated: false,
          error: "Failed to authenticate user",
        });
      });
  }, []);
  return auth;
}
