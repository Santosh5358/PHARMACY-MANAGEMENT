import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Grid, Alert, CircularProgress } from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to check password strength
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    } else {
      setPasswordMatchError('');
    }

    if (!validatePassword(password)) {
      setFormError('Password does not meet the required criteria.');
      return;
    } else {
      setFormError('');
    }

    setLoading(true); // Start loading

    try {
      await axios.post('https://pharmacy-management-7t8g.onrender.com/register', { username, email, age, password, phone });
      alert('User registered successfully');
      navigate('/');
    } catch (error) {
      alert('Registration failed');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Navigate to login page
  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <Paper style={{ padding: '10px', maxWidth: '600px', margin: 'auto', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>Registration </Typography>

        {formError && <Alert severity="error">{formError}</Alert>} {/* Display form errors */}
        {passwordError && <Alert severity="error">{passwordError}</Alert>} {/* Display password error */}
        {passwordMatchError && <Alert severity="error">{passwordMatchError}</Alert>} {/* Display password match error */}

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>

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
                label="Phone"
                type="tel"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Age"
                type="number"
                fullWidth
                value={age}
                onChange={(e) => setAge(e.target.value)}
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
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Redirect to login page */}
        <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
          <Button
            variant="text"
            color="secondary"
            onClick={handleLoginRedirect}
            fullWidth
          >
            Already have an account? Login here
          </Button>
        </Grid>
      </div>
    </Paper>
  );
};

export default Register;
