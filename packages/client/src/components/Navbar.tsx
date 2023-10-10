import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import Link from "@mui/material/Link";

import * as Colors from "@mui/material/colors";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { PrimaryButton, SecondaryButton } from "./mui/Button";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

import IconButton from "@mui/material/IconButton";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Divider from "@mui/material/Divider";

import Logo from "./Logo";

const Appbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Stack
      as="nav"
      direction="row"
      justifyContent="space-between"
      sx={{ padding: ".75rem", margin: "0 auto" }}
    >
      <Logo />

      {isMobile && (
        <IconButton aria-label="delete" onClick={() => setMobileMenuOpen(true)}>
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/documentation" >
              <ListItemText primary="Documentation" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/github">
              <ListItemText primary="GitHub" />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/login">
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/signup">
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {!isMobile && (
        <>
          <Stack direction="row" spacing={1} alignItems="center">
            <Link component={RouterLink} to="/documentation">
              Documentation
            </Link>
            <Link component={RouterLink} to="https://github.com/aadv1k/newsman" target="_blank">
              GitHub
            </Link>
          </Stack>

          <Stack direction="row" spacing={1}>
            <SecondaryButton
              size="medium"
              customSx={{
                border: "none",
                "&:hover": { border: "none" },
                    textDecoration: 'none', color: "inherit" 
              }}
                component={RouterLink}
                to="/login"
            >
                Login
            </SecondaryButton>
            <PrimaryButton size="medium"
                component={RouterLink}
                to="/signup"
                customSx={{ color: "white" }}
            >
                Sign Up
            </PrimaryButton>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Appbar;
