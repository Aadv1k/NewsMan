import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { ThemeProvider } from '@mui/material/styles';

import MuiTheme from "./MuiTheme";

import * as Colors from "@mui/material/colors";
import { PrimaryButton, SecondaryButton } from './components/mui/Button';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import DemoCard from "./components/DemoCode";

import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Navbar from "./components/Navbar";

function App() {
  return (
    <>
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline>
                <Box sx={{ maxWidth: "60rem", margin: "0 auto"}}>
                    <Navbar />
                    <Stack spacing={4} alignItems="center" sx={{ padding: ".75rem", marginBlock: "4.25rem 2.5rem"}}>

                        <Stack spacing={1} alignItems="center">
                            <Typography component="h1" variant="h1" sx={{ fontFamily: "headingFontFamily", letterSpacing: "-0.025em", maxWidth: "20ch", textAlign: "center" }}>
                                A Free and Open-Source alternative to NewsAPI
                            </Typography>
                            <Typography  variant="subtitle1" sx={{ color: "#6c7887", maxWidth: "60ch", textAlign: "center"}}>
                                Use the @newsman/core to self-host, or use our free (mostly) unlimited API to access the service.
                            </Typography>
                        </Stack>

                        <PrimaryButton size="medium" endIcon={<ArrowForwardIcon  />} customSx={{
                                           padding: ".75rem 1.75rem",
                                           borderRadius: ".75rem",
                                       }}>Get a free key</PrimaryButton> </Stack>


                <DemoCard method="GET" data={{}} url="https://newsman.host-here.app/v1/headlines?q=YOUR_API_KEY"/>
                </Box>



            </CssBaseline>
        </ThemeProvider>
    </>
  )
}

export default App
