import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#232c34",
      light: "#3c4c5a"
    },
  },
    typography: {
       "fontFamily": `"Inter", "Helvetica", "Arial", sans-serif`,
        headingFontFamily: `Syne, "Times New Roman", sans-serif`,

        h1: {
            fontSize: '3.25rem',
            '@media (min-width:600px)': {
                fontSize: '3.75rem',
            },
        }
   }
});

export default theme;