import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Grid, Alert } from '@mui/material';
import axios from 'axios';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    problem: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/contact-us', form);
      if (response.data.success) {
        setSuccess('Message sent successfully!');
        setForm('')
        setError('');
      }
    } catch (err) {
      setError('There was an error. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Contact Us</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Problem" name="problem" value={form.problem} onChange={handleChange} fullWidth multiline rows={4} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Submit</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContactUs;
