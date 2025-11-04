import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import './login.css'; 

const LoginPage = () => {

 return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage:`url("/gym_image.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: 'center',
     }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350, bgcolor: '#3A3A3C', color: '#ffffff', borderRadius: '8px'}}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Login
        </Typography>

        <br></br>
        <Typography fontSize="20px" align="center" color="#AAAAAA">
          Work for a better you
        </Typography>

        <br></br>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
            sx={{
               bgcolor: '#606060',
               input: { color: '#AAAAAA' },
               label: { color: '#AAAAAA' }, 
               borderRadius: '8px',
               boxShadow: '1px 1px 1px #B5B5B5'
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            sx={{
               bgcolor: '#606060',
               input: { color: '#AAAAAA' },
               label: { color: '#AAAAAA' }, 
               borderRadius: '8px',
               boxShadow: '1px 1px 1px #B5B5B5'
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2,
                bgcolor: '#b84d00ff',
             }}
          >
            <Typography 
                fontSize="20px"
                fontWeight="bold"
               > 
                Login
            </Typography>
            
          </Button>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                margin="10px 0"
                >
                <Typography fontSize="15px" color="#AAAAAA">
                    Forgot Password
                </Typography>
                <Typography fontSize="15px" color="#AAAAAA">
                    Sign Up
                </Typography>
            </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
