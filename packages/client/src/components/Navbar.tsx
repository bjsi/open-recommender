import React from "react";
import { useAuth } from "../lib/useAuth";
import { NAVBAR_HEIGHT } from "../lib/consts";
import { login } from "../lib/login";
import { AccountDropdown } from "./AccountDropdown";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <nav
      style={{
        height: NAVBAR_HEIGHT,
        maxHeight: NAVBAR_HEIGHT,
      }}
      className="flex items-center justify-between p-4 bg-gray-200"
    >
      <h1
        onClick={() => {
          navigate("/");
        }}
        className="text-lg font-semibold cursor-pointer"
      >
        Open Recommender
      </h1>
      {!auth?.authenticated ? (
        <button
          onClick={() => {
            if (!auth?.authenticated) {
              login();
            }
          }}
          className="px-2 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Login
        </button>
      ) : (
        <AccountDropdown user={auth.user} />
      )}
    </nav>
  );
}
