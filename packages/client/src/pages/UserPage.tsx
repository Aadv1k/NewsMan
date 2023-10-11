import React, { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Snackbar, Button, Chip, Tooltip, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { PrimaryButton, SecondaryButton } from "../components/mui/Button";

import Navbar from "../components/Navbar";

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';

import * as Colors from '@mui/material/colors';


import { googlecode as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";


export default function UserPage() {
  const [user, setUser] = useContext(UserContext);
  const [apiKey, setApiKey] = useState(null);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error",
  });

  useEffect(() => {
    if (!user.token) {
      return navigate("/login");
    }

    fetch(`${import.meta.env.VITE_API_URL}/v1/keys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 500) {
            setUser({});
            return navigate("/login");
        } else {
          const data = await res.json();
          setApiKey(data.data.key.key);
        }
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "An error occurred while fetching keys. Please try again later.",
          type: "error",
        });
      });

  }, [user, navigate, apiKey]);

  const createApiKey = () => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/keys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setSnackbar({
            open: true,
            message: "Failed to create a new key. Please try again later.",
            type: "error",
          });
        } else {
          const data = await res.json();
          setApiKey(data.data.key.key);
        }
      });
  };

  const deleteKey = () => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/keys`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setSnackbar({
            open: true,
            message: "Failed to delete the key. Please try again later.",
            type: "error",
          });
        } else {
          setApiKey(null);
        }
      });
  };

  const deleteAccount = () => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setSnackbar({
            open: true,
            message: "Failed to delete the account. Please try again later.",
            type: "error",
          });
        } else {
          setUser({});
          navigate("/");
        }
      });
  };


  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return user.token ? (
    <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
        <Navbar />

        <Stack px={{ padding: "0.75rem"}} alignItems="flex-start" spacing={2}>
            <SyntaxHighlighter
                language="json"
                style={syntaxStyle}
                customStyle={{
                width: "100%",
                padding: "0.75rem",
                }}
            >
                {JSON.stringify({email: user.email, apiKey: apiKey } , null, 2)}
            </SyntaxHighlighter>


            <Stack direction="row" alignItems="center" spacing={2}>
                {apiKey ? <Button variant="outlined" color="error" onClick={deleteKey}>Delete Key</Button> :  <Button variant="contained" onClick={createApiKey}>Create Key</Button>  }
                <Button variant="outlined" color="error" onClick={deleteAccount}>Delete Account</Button>
            </Stack>

            
        </Stack>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={2500} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  ) : null;
}
