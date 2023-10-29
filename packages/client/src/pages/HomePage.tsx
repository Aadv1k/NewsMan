import * as Colors from "@mui/material/colors";
import { Stack, Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Link as RouterLink } from "react-router-dom";

import DemoCard from "../components/DemoCode";
import Navbar from "../components/Navbar";
import { PrimaryButton, SecondaryButton } from "../components/mui/Button";

export default function HomePage() {
  return (
    <Box sx={{ maxWidth: "60rem", margin: "0 auto" }}>
      <Navbar />

      <Stack
        spacing={2}
        alignItems="center"
        sx={{ padding: ".75rem", marginBlock: "1.25rem" }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h1"
            sx={{
              fontFamily: "headingFontFamily",
              letterSpacing: "-0.025em",
              maxWidth: "20ch",
              textAlign: "center",
            }}
          >
            Your Very Own, Totally Free, and Self-Hosted NewsAPI Alternative
          </Typography>
          <Typography
            variant="subtitle1"
            color="grey.800"
            sx={{ maxWidth: "45ch", textAlign: "center" }}
          >
              Use our completely free API or hack the open-source infrastructure on your own machine
          </Typography>

        <PrimaryButton
          size="medium"
          endIcon={<ArrowForwardIcon />}
          customSx={{
            padding: ".75rem 1.75rem",
            borderRadius: ".25rem",
          }}
            component={RouterLink}
            to="/signup"
        >
          Get a free key
        </PrimaryButton>
        </Stack>
      </Stack>

      <Box sx={{ position: "relative", height: "fit-content" }}>
        <Box
          sx={{
            bottom: "0",
            right: "5%",
            width: "350px",
            height: "350px",
            backgroundColor: Colors.red[100],
            position: "absolute",
            borderRadius: "9999px",
            filter: "blur(40px)"
          }}
        />

        <Box
          sx={{
            top: "0",
            left: "5%",
            width: "250px",
            height: "250px",
            backgroundColor: Colors.blue[100],
            position: "absolute",
            borderRadius: "9999px",
            filter: "blur(35px)"
          }}
        />

        <DemoCard
          method="GET"
          data={{}}
          url="https://newsman.host-here.app/v1/headlines?q=YOUR_API_KEY"
        />
      </Box>
    </Box>
  );
}
