import Navbar from "../components/Navbar";
import GenericForm from "../components/GenericForm";
import Logo from "../components/Logo";

import { Stack, Box, Typography } from "@mui/material";

import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user.token ? (
    <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
        <Navbar />
        {user.email}
    </Box>
  ) : null;
}
