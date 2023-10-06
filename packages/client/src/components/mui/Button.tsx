import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import * as Colors from "@mui/material/colors";

export function PrimaryButton({ children, ...rest }) {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#232c34",
        textTransform: "capitalize",
        borderRadius: "3px",
        boxShadow: "none",
        fontWeight: "bold",
        "&:hover": {
          boxShadow: "none",
        },
        ...rest.customSx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export function SecondaryButton({ children, ...rest }) {
  return (
    <Button
      variant="outlined"
      sx={{
        backgroundColor: "transparent",
        textTransform: "capitalize",
        borderRadius: "3px",
        boxShadow: "none",
        fontWeight: "bold",
        "&:hover": {
          boxShadow: "none",
        },
        ...rest.customSx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
