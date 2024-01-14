import React, { useState } from "react";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { logout } from "../lib/login";
import { useNavigate } from "react-router-dom";
import { User } from "shared/types/user";

interface AccountDropdownProps {
  user: User;
}

export const AccountDropdown = (props: AccountDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Logic to logout
    logout();
    handleClose();
  };

  return (
    <div className="cursor-pointer">
      <Avatar
        onClick={handleClick}
        sx={{
          width: 24,
          height: 24,
        }}
        src={props.user.profile_image_url}
      ></Avatar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            navigate("/user/" + props.user.username + "/profile");
            handleClose();
          }}
        >
          View Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
