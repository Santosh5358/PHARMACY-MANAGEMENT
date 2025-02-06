import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Grid, Alert, CircularProgress } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading status
  const [error, setError] = useState(''); // Store error messages
  const navigate = useNavigate();

  // Handle Login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Reset previous errors
    
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data

      // Clear the form
      setEmail('');
      setPassword('');

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials, please try again.'); // Show error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Redirect to the register page
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '400px', margin: 'auto', height: '74.5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>

        {error && <Alert severity="error">{error}</Alert>} {/* Display error */}

        <form onSubmit={handleLogin}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Register Button */}
        <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
          <Button
            variant="text"
            color="secondary"
            onClick={handleRegisterRedirect}
            fullWidth
          >
            Don't have an account? Register
          </Button>
        </Grid>
      </div>
    </Paper>
  );
};

export default Login;
