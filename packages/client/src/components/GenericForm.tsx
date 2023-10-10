import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Link as RouterLink } from 'react-router-dom';

import { PrimaryButton } from "./mui/Button.tsx";

interface GenericFormProps {
  onSubmit: (data: any) => void;
  title: string;
  subtitle: string;
  linkTo: string;
}

export default function GenericForm({ title, onSubmit, subtitle, linkTo }: GenericFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
      onSubmit(formData);
    }
  };

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            error={emailError !== ''}
            helperText={emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
            }
            label="Remember me"
          />
            <PrimaryButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{
                  mt: 3, mb: 2,
                  padding: ".75rem 1.75rem",
                }}
          >
            { title }
          </PrimaryButton>

            <RouterLink to={linkTo} style={{ textDecoration: 'underline', color: "inherit"}}>
                <Typography
                    variant="body2"
                    sx={{ display: 'block', margin: '0 auto', textAlign: 'center'}}
                >
                    {subtitle}
                </Typography>
            </RouterLink>
        </Box>
      </Box>
    </Container>
  );
}
