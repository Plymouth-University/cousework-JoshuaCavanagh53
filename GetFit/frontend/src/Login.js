import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";


const LoginPage = () => {
  const usernameSVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <circle
          cx="12"
          cy="6"
          r="4"
          stroke="#AAAAAA"
          stroke-width="1.5"
        ></circle>{" "}
        <path
          d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
          stroke="#AAAAAA"
          stroke-width="1.5"
        ></path>{" "}
      </g>
    </svg>
  );
  const passwordSVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
          stroke="#AAAAAA"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background:"#2b2d2eff"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          bgcolor: "#3A3A3C",
          color: "#ffffff",
          borderRadius: "8px",
        }}
      >
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
              
              bgcolor: "#606060",
              input: { color: "#AAAAAA" },
              label: { color: "#AAAAAA" },
              borderRadius: "8px",

              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#000000ff",
                },
              },
              "& label.Mui-focused": {
                color: "#000000ff",
              },
            }}
            />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            sx={{
              bgcolor: "#606060",
              input: { color: "#AAAAAA" },
              label: { color: "#AAAAAA" },
              borderRadius: "8px",

              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#000000ff",
                },
              },
              "& label.Mui-focused": {
                color: "#000000ff",
              },
            }}
          />

         
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: "#b84d00ff" }}
          >
            <Typography fontSize="20px" fontWeight="bold">
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
