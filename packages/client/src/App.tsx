import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import MuiTheme from "./MuiTheme";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles styles={{ body: { backgroundColor: "cccccc" } }} />
        <CssBaseline>
          <HomePage />
        </CssBaseline>
      </ThemeProvider>
    </>
  );
}

export default App;
