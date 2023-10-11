import React, { useState, useContext, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

import UserContext from "../UserContext";
import Logo from "../components/Logo";
import GenericForm from "../components/GenericForm";

const exampleData = {
    "status": "success",
    "message": "Successfully registered and logged in for the user",
    "data": {
        "user": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUzNDk5NWFlLWQ5ZGQtNDQ4MS05ZmM3LTIzMWI2YzJlMDI4NyIsImlhdCI6MTY5NjIzMDUxOCwiZXhwIjoxNjk2MjM0MTE4fQ._jEGlWD3ZmBljR43-NoC1tCwO1dGI-Gd4G-DK16Afjs",
            "email": "aadv1k@outlook.com"
        }
    }
}

export default function LoginPage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.token) {
      navigate("/account");
    }
  }, [user, navigate]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;

    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleFormSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

     const resData = await res.json();

      if (resData?.error) {
        const errorMessage = resData.error.message;
        setSnackbar({
          ...snackbar,
          open: true,
          message: errorMessage,
        });
        return;
      }

      //const { token: jwtToken, email: userEmail } = (await res.json()).data.user;
      const { token: jwtToken, email: userEmail } = resData.data.user;
        console.log(jwtToken);
      const [header, payload, signature] = jwtToken.split(".");
      const { id } = JSON.parse(atob(payload));

      setUser({
        uid: id,
        email: userEmail,
        token: jwtToken,
      });

      setSnackbar({
        ...snackbar,
        open: true,
        message: "Successful login! Redirecting...",
        type: "success",
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        ...snackbar,
        open: true,
        message: "An error occurred during login.",
        type: "error",
      });
    }
  };

  return !user.token ? (
    <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
      <Stack
        as="nav"
        direction="row"
        justifyContent="space-between"
        sx={{ padding: ".75rem", margin: "0 auto" }}
      >
        <Logo />
      </Stack>

      <GenericForm
        title="Login"
        onSubmit={handleFormSubmit}
        subtitle="Don't have an account? Sign Up"
        linkTo="/signup"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbar.type}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  ) : null;
}
