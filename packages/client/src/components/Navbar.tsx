import React from "react";
import { useAuth } from "../lib/useAuth";
import { Avatar } from "@mui/material";
import { NAVBAR_HEIGHT } from "../lib/consts";

export function Navbar() {
  const auth = useAuth();
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
          window.open("http://localhost:5173/", "_self");
        }}
        className="text-lg font-semibold cursor-pointer"
      >
        Open Recommender
      </h1>
      <button
        onClick={() => {
          window.open("http://localhost:3000/auth/twitter", "_self");
        }}
        className="px-2 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        {!auth?.authenticated ? (
          "Login"
        ) : (
          <div className="flex items-center gap-2">
            <Avatar
              sx={{
                width: 24,
                height: 24,
              }}
              src={auth.user.profile_image_url!}
            ></Avatar>
            <div>Logout</div>
          </div>
        )}
      </button>
    </nav>
  );
}
