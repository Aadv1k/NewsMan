import React from 'react';
import { Link } from 'react-router-dom'; 
import Typography from '@mui/material/Typography';

export default function Logo() {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Typography
        variant="h5"
        component="div"
        fontFamily="headingFontFamily"
        sx={{ color: 'black', fontWeight: 'bold', width: 'fit-content' }}
      >
        NewsMan
      </Typography>
    </Link>
  );
}
