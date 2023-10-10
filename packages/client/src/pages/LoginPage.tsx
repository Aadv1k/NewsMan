import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Logo from "../components/Logo";
import GenericForm from "../components/GenericForm";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function LoginPage() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
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
      if (!res.ok) {
        throw new Error(resData.error.message); 
      }

    const jwtToken = resData.data.user.token;

    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      console.error(error);
    }
  };

  return (
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
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
