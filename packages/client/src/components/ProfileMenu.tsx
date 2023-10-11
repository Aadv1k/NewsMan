import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import UserContext from "../UserContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { PrimaryButton, SecondaryButton } from "./mui/Button";

export default function UserMenu() {
  const [user] = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <PrimaryButton
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        customSx={{ textTransform: "unset" }}
      >
        {user.email}
      </PrimaryButton>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={RouterLink} to="/account" onClick={handleClose}>
          My account
        </MenuItem>
        <MenuItem component={RouterLink} to="/logout" onClick={handleClose}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
