import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { PrimaryButton, SecondaryButton } from "./mui/Button";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import UserContext from "../UserContext";
import Logo from "./Logo";

import ProfileMenu from "./ProfileMenu";

const Appbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px");
  const [user] = useContext(UserContext);

  return (
    <Stack
      as="nav"
      direction="row"
      justifyContent="space-between"
      sx={{ padding: ".75rem", margin: "0 auto" }}
    >
      <Logo />

      {isMobile && (
        <IconButton aria-label="menu" onClick={() => setMobileMenuOpen(true)}>
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
            <ListItemButton component={RouterLink} to="/documentation">
              <ListItemText primary="Documentation" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/github">
              <ListItemText primary="GitHub" />
            </ListItemButton>
          </ListItem>

          <Divider />

            {!user.token ? (
                <>
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
                </>
              ) : (
                  <>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/account">
                        <ListItemText primary="My Account" />
                    </ListItemButton>
                </ListItem>


                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/logout">
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>

                 </>
              )}
        </List>
      </Drawer>

      {!isMobile && (
        <>
          <Stack direction="row" spacing={1} alignItems="center">
            <Link component={RouterLink} to="/documentation">
              Documentation
            </Link>
            <Link component="a" href="https://github.com/aadv1k/newsman" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Stack>

          <Stack direction="row" spacing={1}>
            {!user.token ? (
              <>
                <SecondaryButton
                  size="medium"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  component={RouterLink}
                  to="/signup"
                  customSx={{ color: "white" }}
                >
                  Sign Up
                </PrimaryButton>
              </>
            ) : (
                <ProfileMenu />
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Appbar;
