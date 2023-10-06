import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import MuiTheme from "./MuiTheme";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <CssBaseline>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </CssBaseline>
      </ThemeProvider>
    </>
  );
}

export default App;
