import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import MuiTheme from "./MuiTheme";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";

import UserContext from "./UserContext";
import { useState } from "react";

import { IUserContext } from "./types";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState<IUserContext>({});

    return (
        <>
            <UserContext.Provider value={[user, setUser]}>
                <ThemeProvider theme={MuiTheme}>
                    <CssBaseline>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/signup" element={<SignUpPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/account" element={<UserPage />} />
                            </Routes>
                        </BrowserRouter>
                    </CssBaseline>
                </ThemeProvider>
            </UserContext.Provider>
        </>
    );
}

export default App;
