import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Grid, Alert } from '@mui/material';
import axios from 'axios';

const ViewProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    age: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(''); // Store user ID (you may retrieve this from localStorage or auth)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setUserId(storedUser._id);  // Make sure you set the user ID from localStorage or your authentication logic
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdatePhone = async () => {
    try {
      const updatedUser = { phone: user.phone };

      // Send the updated phone number to the backend
      const response = await axios.put(`http://localhost:5000/update-phone/${userId}`, updatedUser);

      if (response.data.success) {
        setSuccess('Phone number updated successfully!');
        setError('');
        const updatedData = { ...user, phone: user.phone };
        localStorage.setItem('user', JSON.stringify(updatedData)); // Update user data in localStorage
      } else {
        setError('Failed to update phone number');
        setSuccess('');
      }
    } catch (error) {
      setError('There was an error. Please try again.');
      setSuccess('');
    }
  };

  const handleChangePassword = async () => {
    if (user.newPassword !== user.confirmPassword) {
      setError('New passwords do not match!');
      setSuccess('');
      return;
    }

    try {
      // Send old password, new password, and user ID to the backend
      const response = await axios.post('http://localhost:5000/change-password', {
        oldPassword: user.oldPassword,
        newPassword: user.newPassword,
        userId: userId,
      });

      if (response.data.success) {
        setSuccess('Password updated successfully!');
        setUser.newPassword='';
        setUser.oldPassword='';
        setUser.confirmPassword='';
        setError('');
      } else {
        setError(response.data.message);
        setSuccess('');
      }
    } catch (error) {
      setError('There was an error. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Paper style={{ padding: '40px' }}>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Username" value={user.username} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email" value={user.email} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Age" value={user.age} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Phone" name="phone" value={user.phone} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdatePhone} fullWidth>Update Phone</Button>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Old Password"
            name="oldPassword"
            type="password"
            value={user.oldPassword}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={user.newPassword}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={user.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>Change Password</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ViewProfile;
